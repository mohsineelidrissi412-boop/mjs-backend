import { Response, Request } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth';

export interface Settings {
  institution_email: string;
  phone_number: string;
  facebook_url: string;
  instagram_url: string;
  location: string;
}

// Paramètres globaux en mémoire (source unique de vérité)
const globalSettings: Settings = {
  institution_email: 'contact@mj-alqods.ma',
  phone_number: '+212 5XX-XXXXXX',
  facebook_url: 'https://facebook.com/mj-alqods',
  instagram_url: 'https://instagram.com/mj-alqods',
  location: 'Benguerir, Maroc'
};

export class SettingsController {
  static getSettings(req: Request, res: Response) {
    return res.json(globalSettings);
  }

  static updateSettings(req: AuthenticatedRequest, res: Response) {
    const { institution_email, phone_number, facebook_url, instagram_url, location } = req.body;

    if (institution_email) globalSettings.institution_email = institution_email;
    if (phone_number) globalSettings.phone_number = phone_number;
    if (facebook_url) globalSettings.facebook_url = facebook_url;
    if (instagram_url) globalSettings.instagram_url = instagram_url;
    if (location) globalSettings.location = location;

    return res.json({ message: "Paramètres mis à jour avec succès.", settings: globalSettings });
  }
}
