/**
 * @type {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
    // Tabla de roles
    pgm.createTable('roles', {
      id: { type: 'serial', primaryKey: true },
      name: { type: 'text', notNull: true, unique: true }, // 'discapacitado', 'empresa'
    });
  
    // Tabla de usuarios
    pgm.createTable('users', {
      id: { type: 'serial', primaryKey: true },
      name: { type: 'text', notNull: true },
      email: { type: 'text', notNull: true, unique: true },
      password: { type: 'text', notNull: true },
      role_id: { 
        type: 'integer', 
        notNull: true, 
        references: 'roles', 
        onDelete: 'SET NULL' 
      },
      disability_certificate_url: { type: 'text' },
      verified: { type: 'boolean', notNull: true, default: false },
      created_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
    });
  
    // Crear índice para la relación entre usuarios y roles
    pgm.createIndex('users', 'role_id');
  
    // Tabla de empresas (registradas por usuarios con rol empresa)
    pgm.createTable('companies', {
      id: { type: 'serial', primaryKey: true },
      owner_id: { type: 'integer', notNull: true, references: 'users', onDelete: 'CASCADE' },
      name: { type: 'text', notNull: true },
      description: { type: 'text' },
      logo_url: { type: 'text' },
      created_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
    });
  
    // Tabla de vacantes
    pgm.createTable('jobs', {
      id: { type: 'serial', primaryKey: true },
      company_id: { type: 'integer', notNull: true, references: 'companies', onDelete: 'CASCADE' },
      title: { type: 'text', notNull: true },
      description: { type: 'text', notNull: true },
      requirements: { type: 'text' },
      disability_filter: { type: 'text' },
      location: { type: 'text' },
      modality: { type: 'text' },
      salary_range: { type: 'text' },
      applicant_count: { type: 'integer', notNull: true, default: 0 },
      created_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
    });
  
    // Tabla de postulaciones
    pgm.createTable('applications', {
      id: { type: 'serial', primaryKey: true },
      user_id: { type: 'integer', notNull: true, references: 'users', onDelete: 'CASCADE' },
      job_id: { type: 'integer', notNull: true, references: 'jobs', onDelete: 'CASCADE' },
      status: { type: 'text', notNull: true, default: 'pending' },
      applied_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
    });
  
    // Crear índice único para la combinación de user_id y job_id en la tabla applications
    pgm.createIndex('applications', ['user_id', 'job_id'], { unique: true });
  
    // Trigger para actualizar el contador de postulantes
    pgm.sql(`
      CREATE OR REPLACE FUNCTION increment_applicant_count()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE jobs SET applicant_count = applicant_count + 1 WHERE id = NEW.job_id;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
  
      CREATE TRIGGER trg_increment_applicant_count
      AFTER INSERT ON applications
      FOR EACH ROW
      EXECUTE FUNCTION increment_applicant_count();
    `);
  
    // Tabla de cursos (publicados por empresas)
    pgm.createTable('courses', {
      id: { type: 'serial', primaryKey: true },
      owner_id: { type: 'integer', notNull: true, references: 'users', onDelete: 'CASCADE' },
      title: { type: 'text', notNull: true },
      description: { type: 'text' },
      type: { type: 'text', notNull: true },
      resource_url: { type: 'text', notNull: true },
      created_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
    });
  };
  
  exports.down = (pgm) => {
    // Eliminar trigger y función
    pgm.sql(`
      DROP TRIGGER IF EXISTS trg_increment_applicant_count ON applications;
      DROP FUNCTION IF EXISTS increment_applicant_count;
    `);
  
    pgm.dropTable('courses');
    pgm.dropTable('applications');
    pgm.dropTable('jobs');
    pgm.dropTable('companies');
    pgm.dropTable('users');
    pgm.dropTable('roles');
  };
  