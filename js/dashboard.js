document.addEventListener("DOMContentLoaded", async () => {
    // 1. Protection de la route
    const user = window.api.getUser();
    if (!user || user.role !== 'ADMIN') {
        window.location.href = "../public/login.html";
        return;
    }

    // 2. Afficher les infos de l'utilisateur
    const userNameEl = document.getElementById("user-name");
    const userRoleEl = document.getElementById("user-role");
    const userAvatarEl = document.getElementById("user-avatar");

    if (userNameEl) userNameEl.textContent = `${user.first_name} ${user.last_name}`;
    if (userRoleEl) userRoleEl.textContent = user.role;
    if (userAvatarEl && user.profile_picture_url) {
        userAvatarEl.src = `http://localhost:8000${user.profile_picture_url}`;
    }

    // 3. Récupérer les statistiques
    try {
        const stats = await window.api.fetch('/statistics/admin');
        
        const statMembers = document.getElementById("stat-members");
        const statPending = document.getElementById("stat-pending");
        const statEvents = document.getElementById("stat-events");
        const statClubs = document.getElementById("stat-clubs");

        if (statMembers) statMembers.textContent = stats.membersCount || 0;
        if (statPending) statPending.textContent = stats.pendingUsersCount || 0;
        if (statEvents) statEvents.textContent = stats.monthlyEvents || 0;
        if (statClubs) statClubs.textContent = stats.clubsCount || 0;

    } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error);
    }
});
