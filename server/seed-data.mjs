import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/').pop() || 'feasibility_study',
  waitForConnections: true,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

async function seedData() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🌱 Seeding database with test data...');

    // Créer une étude
    const studyResult = await connection.execute(
      `INSERT INTO studies (userId, title, description, status, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [1, 'Projet de Transformation Digitale', 'Étude de faisabilité pour la transformation digitale de l\'entreprise', 'active']
    );
    const studyId = studyResult[0].insertId;
    console.log(`✅ Created study: ${studyId}`);

    // Créer 5 options
    const optionNames = [
      { name: 'Option 1 - Solution A', desc: 'Solution traditionnelle avec infrastructure interne' },
      { name: 'Option 2 - Solution B', desc: 'Solution cloud avec services managés' },
      { name: 'Option 3 - Solution C', desc: 'Solution hybride avec migration progressive' },
      { name: 'Option 4 - Solution D', desc: 'Solution SaaS avec intégrations tierces' },
      { name: 'Option 5 - Solution E', desc: 'Solution open-source personnalisée' },
    ];

    const optionIds = [];
    for (const opt of optionNames) {
      const result = await connection.execute(
        `INSERT INTO options (studyId, name, description, status, globalScore, costScore, delayScore, feasibilityScore, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [studyId, opt.name, opt.desc, 'in_progress', Math.floor(Math.random() * 40 + 50), Math.floor(Math.random() * 40 + 40), Math.floor(Math.random() * 40 + 50), Math.floor(Math.random() * 40 + 60)]
      );
      optionIds.push(result[0].insertId);
    }
    console.log(`✅ Created 5 options`);

    // Créer des postes pour chaque option
    const postNames = [
      { name: 'Poste 1.1 - Recherche techno', desc: 'Étude des technologies disponibles' },
      { name: 'Poste 1.2 - Partenaires', desc: 'Identification des partenaires' },
      { name: 'Poste 1.3 - Prototype', desc: 'Développement du prototype' },
    ];

    const postIds = [];
    for (const optionId of optionIds) {
      for (const post of postNames) {
        const result = await connection.execute(
          `INSERT INTO posts (optionId, name, description, status, advancement, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
          [optionId, post.name, post.desc, 'in_progress', Math.floor(Math.random() * 80)]
        );
        postIds.push(result[0].insertId);
      }
    }
    console.log(`✅ Created ${postIds.length} posts`);

    // Créer des actions pour chaque poste
    const actionNames = [
      { name: 'Analyse faisabilité', desc: 'Analyser la faisabilité technique' },
      { name: 'Veille & benchmark', desc: 'Faire une veille concurrentielle' },
      { name: 'Identifier partenaires', desc: 'Identifier les partenaires potentiels' },
      { name: 'Négociation', desc: 'Négocier les contrats' },
      { name: 'Développement MVP', desc: 'Développer le MVP' },
      { name: 'Tests utilisateur', desc: 'Tester avec les utilisateurs' },
    ];

    for (const postId of postIds) {
      for (let i = 0; i < 3; i++) {
        const action = actionNames[Math.floor(Math.random() * actionNames.length)];
        await connection.execute(
          `INSERT INTO actions (postId, name, description, status, advancement, estimatedDays, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [postId, action.name, action.desc, ['idea', 'in_progress', 'to_review', 'in_retard', 'terminated'][Math.floor(Math.random() * 5)], Math.floor(Math.random() * 100), Math.floor(Math.random() * 60 + 10)]
        );
      }
    }
    console.log(`✅ Created actions for all posts`);

    // Créer des risques
    for (let i = 0; i < 6; i++) {
      await connection.execute(
        `INSERT INTO risks (studyId, name, description, probability, impact, mitigation, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          studyId,
          `Risque ${i + 1}`,
          `Description du risque ${i + 1}`,
          ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          `Plan de mitigation pour le risque ${i + 1}`
        ]
      );
    }
    console.log(`✅ Created 6 risks`);

    // Créer des alertes
    const alertMessages = [
      '7 actions en retard',
      '6 risques élevés détectés',
      '2 échéances dépassées',
      'Option 5 abandonnée',
      'Coût dépassé de 15%',
      'Délai critique pour Option 2'
    ];

    for (const msg of alertMessages) {
      await connection.execute(
        `INSERT INTO alerts (studyId, message, severity, isResolved, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [studyId, msg, ['low', 'medium', 'high'][Math.floor(Math.random() * 3)], false]
      );
    }
    console.log(`✅ Created ${alertMessages.length} alerts`);

    // Créer des critères d'évaluation
    const criteria = [
      { name: 'Impact / Valeur', weight: 40 },
      { name: 'Faisabilité', weight: 20 },
      { name: 'Coût - Temps', weight: 20 },
      { name: 'Risque', weight: 10 },
      { name: 'Réversibilité', weight: 10 },
    ];

    for (const crit of criteria) {
      await connection.execute(
        `INSERT INTO evaluation_criteria (studyId, name, weight, createdAt, updatedAt) 
         VALUES (?, ?, ?, NOW(), NOW())`,
        [studyId, crit.name, crit.weight]
      );
    }
    console.log(`✅ Created ${criteria.length} evaluation criteria`);

    // Créer des règles de statut
    const rules = [
      { name: 'Statut mis à jour selon les dates', resultStatus: 'in_retard' },
      { name: 'Alerte si avancement < 30%', resultStatus: 'to_review' },
      { name: 'Propagation du statut "Abandonné" aux postes liés', resultStatus: 'abandoned' },
    ];

    for (const rule of rules) {
      await connection.execute(
        `INSERT INTO status_rules (studyId, name, resultStatus, isActive, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [studyId, rule.name, rule.resultStatus, true]
      );
    }
    console.log(`✅ Created ${rules.length} status rules`);

    console.log('\n✨ Database seeding completed successfully!');
    console.log(`📊 Study ID: ${studyId}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await connection.release();
    await pool.end();
  }
}

seedData().catch(console.error);
