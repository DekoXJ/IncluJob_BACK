exports.up = (pgm) => {
    pgm.addColumn('users', {
      disability: {
        type: 'text',
        notNull: false,
        default: null,
      },
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropColumn('users', 'disability');
  };
  