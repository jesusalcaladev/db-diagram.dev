export const TypesValues = {
  mysql: {
    numeric: [
      'TINYINT',
      'SMALLINT',
      'MEDIUMINT',
      'INT',
      'BIGINT',
      'DECIMAL',
      'FLOAT',
      'DOUBLE',
    ],
    string: ['CHAR', 'VARCHAR', 'TINYTEXT', 'TEXT', 'MEDIUMTEXT', 'LONGTEXT'],
    date: ['DATE', 'DATETIME', 'TIMESTAMP', 'TIME', 'YEAR'],
    binary: [
      'BINARY',
      'VARBINARY',
      'TINYBLOB',
      'BLOB',
      'MEDIUMBLOB',
      'LONGBLOB',
    ],
    other: ['BOOLEAN', 'ENUM', 'SET', 'JSON'],
  },
  mongodb: {
    numeric: ['Double', 'Number', 'Int32', 'Int64', 'Decimal128'],
    string: ['String', 'ObjectId', 'Regular Expression'],
    date: ['Date', 'Timestamp'],
    binary: ['Binary Data'],
    other: ['Boolean', 'Array', 'Object', 'Null', 'Symbol', 'Mixed'],
  },
}
