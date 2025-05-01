
/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  // Tabla de usuarios
  pgm.createTable('users', {
    id:           { type: 'serial', primaryKey: true },
    name:         { type: 'text',   notNull: true },
    email:        { type: 'text',   notNull: true, unique: true },
    password:     { type: 'text',   notNull: true },
    disability:   { type: 'text',   notNull: true },
    created_at:   { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
  });

  // Tabla de empresas
  pgm.createTable('companies', {
    id:           { type: 'serial', primaryKey: true },
    name:         { type: 'text',   notNull: true },
    description:  { type: 'text' },
    created_at:   { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
  });

  // Tabla de vacantes (jobs)
  pgm.createTable('jobs', {
    id:               { type: 'serial',   primaryKey: true },
    company_id:       { type: 'integer',  notNull: true, references: '"companies"', onDelete: 'CASCADE' },
    title:            { type: 'text',     notNull: true },
    description:      { type: 'text',     notNull: true },
    requirements:     { type: 'text' },
    disability_filter:{ type: 'text' },
    created_at:       { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
  });

  // Tabla de cursos
  pgm.createTable('courses', {
    id:           { type: 'serial', primaryKey: true },
    title:        { type: 'text',   notNull: true },
    description:  { type: 'text' },
    type:         { type: 'text',   notNull: true }, // 'text' | 'video' | 'audio'
    resource_url: { type: 'text',   notNull: true },
    created_at:   { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
  });

  // Tabla de postulaciones
  pgm.createTable('applications', {
    id:         { type: 'serial',  primaryKey: true },
    user_id:    { type: 'integer', notNull: true, references: '"users"',    onDelete: 'CASCADE' },
    job_id:     { type: 'integer', notNull: true, references: '"jobs"',     onDelete: 'CASCADE' },
    status:     { type: 'text',    notNull: true, default: 'pending' },
    applied_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  pgm.dropTable('applications');
  pgm.dropTable('courses');
  pgm.dropTable('jobs');
  pgm.dropTable('companies');
  pgm.dropTable('users');
};
