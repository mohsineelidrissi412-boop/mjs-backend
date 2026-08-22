import { supabase } from './src/core/database';
import { Security } from './src/core/security';
import * as dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
  const email = 'admin@alqods.com';
  const password = 'admin123';
  const first_name = 'Admin';
  const last_name = 'System';
  
  console.log(`Création du compte administrateur: ${email}...`);
  
  // Vérifier si l'admin existe déjà
  const { data: existing } = await supabase.from('users').select('id').eq('email', email).single();
  if (existing) {
    console.log('❌ Ce compte admin existe déjà !');
    process.exit(1);
  }
  
  const password_hash = await Security.hashPassword(password);
  
  const { data, error } = await supabase.from('users').insert({
    email,
    password_hash,
    first_name,
    last_name,
    role: 'ADMIN',
    status: 'ACTIVE' // Actif par défaut pour pouvoir se connecter
  }).select().single();
  
  if (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error.message);
    process.exit(1);
  } else {
    console.log('✅ Compte administrateur créé avec succès !');
    console.log('-------------------------------------------');
    console.log('Email:', email);
    console.log('Mot de passe:', password);
    console.log('Role:', data.role);
    console.log('Status:', data.status);
    console.log('-------------------------------------------');
    process.exit(0);
  }
}

createAdmin();
