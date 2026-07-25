import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth';
import { mockEvents, mockClubs, Event } from '../../core/database';

export class EventsController {
  static getAllEvents(req: AuthenticatedRequest, res: Response) {
    return res.json(mockEvents);
  }

  static createEvent(req: AuthenticatedRequest, res: Response) {
    const { title, description, event_date, event_time, club_id } = req.body;
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!userId) {
      return res.status(401).json({ message: "Non authentifié." });
    }

    // Si encadrant, valider qu'il encadre le club spécifié
    if (role === 'ENCADRANT') {
      if (!club_id) {
        return res.status(400).json({ message: "Un encadrant doit obligatoirement associer son événement à un club." });
      }

      const club = mockClubs.find(c => c.id === club_id);
      if (!club || !club.encadrant_ids.includes(userId)) {
        return res.status(403).json({ message: "Vous n'avez pas l'autorisation de créer des événements pour ce club." });
      }
    }

    const newEvent: Event = {
      id: mockEvents.length + 1,
      title,
      description,
      event_date,
      event_time,
      club_id: club_id ? parseInt(club_id) : undefined,
      creator_id: userId
    };

    mockEvents.push(newEvent);
    return res.status(201).json({ message: "Événement créé avec succès.", event: newEvent });
  }

  static updateEvent(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const event = mockEvents.find(e => e.id === id);

    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé." });
    }

    const userId = req.user?.userId;
    const role = req.user?.role;

    // Si encadrant, valider qu'il est le créateur de cet événement
    if (role === 'ENCADRANT' && event.creator_id !== userId) {
      return res.status(403).json({ message: "Vous ne pouvez modifier que les événements que vous avez créés." });
    }

    const { title, description, event_date, event_time } = req.body;

    if (title) event.title = title;
    if (description) event.description = description;
    if (event_date) event.event_date = event_date;
    if (event_time) event.event_time = event_time;

    return res.json({ message: "Événement mis à jour avec succès.", event });
  }

  static deleteEvent(req: AuthenticatedRequest, res: Response) {
    const id = parseInt(req.params.id);
    const eventIndex = mockEvents.findIndex(e => e.id === id);

    if (eventIndex === -1) {
      return res.status(404).json({ message: "Événement non trouvé." });
    }

    const event = mockEvents[eventIndex];
    const userId = req.user?.userId;
    const role = req.user?.role;

    // Si encadrant, valider qu'il est le créateur
    if (role === 'ENCADRANT' && event.creator_id !== userId) {
      return res.status(403).json({ message: "Vous ne pouvez supprimer que les événements que vous avez créés." });
    }

    mockEvents.splice(eventIndex, 1);
    return res.json({ message: "Événement supprimé avec succès." });
  }
}
