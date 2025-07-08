import { DatabaseSchema, DatabaseTable, DatabaseColumn, DatabaseEngine } from '../types/database';

export const generateSQL = (schema: DatabaseSchema): string => {
  const { database } = schema;
  let sql = '';

  // Add database creation comment
  sql += `-- Database: ${database.name}\n`;
  sql += `-- Engine: ${database.engine.toUpperCase()}\n`;
  sql += `-- Generated at: ${new Date().toISOString()}\n\n`;

  // Generate table creation statements
  database.tables.forEach(table => {
    sql += generateTableSQL(table, database.engine);
    sql += '\n\n';
  });

  // Generate foreign key constraints
  database.relationships.forEach(relationship => {
    const sourceTable = database.tables.find(t => t.id === relationship.sourceTable);
    const targetTable = database.tables.find(t => t.id === relationship.targetTable);
    
    if (sourceTable && targetTable) {
      sql += generateForeignKeySQL(relationship, sourceTable.name, targetTable.name, database.engine);
      sql += '\n';
    }
  });

  return sql;
};

const generateTableSQL = (table: DatabaseTable, engine: DatabaseEngine): string => {
  let sql = `CREATE TABLE ${table.name} (\n`;
  
  // Generate column definitions
  const columnDefs = table.columns.map(column => 
    generateColumnSQL(column, engine)
  );

  // Add primary key constraint if multiple columns
  const primaryKeys = table.columns.filter(col => col.primaryKey);
  if (primaryKeys.length > 1) {
    columnDefs.push(`  PRIMARY KEY (${primaryKeys.map(col => col.name).join(', ')})`);
  }

  // Add unique constraints
  const uniqueColumns = table.columns.filter(col => col.unique && !col.primaryKey);
  uniqueColumns.forEach(col => {
    columnDefs.push(`  UNIQUE KEY uk_${table.name}_${col.name} (${col.name})`);
  });

  sql += columnDefs.join(',\n');
  sql += '\n)';

  // Add engine-specific options
  if (engine === 'mysql') {
    sql += ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci';
  }

  sql += ';';

  // Add indexes
  table.columns.filter(col => col.index && !col.primaryKey && !col.unique).forEach(col => {
    sql += `\nCREATE INDEX idx_${table.name}_${col.name} ON ${table.name} (${col.name});`;
  });

  return sql;
};

const generateColumnSQL = (column: DatabaseColumn, engine: DatabaseEngine): string => {
  let sql = `  ${column.name} `;

  // Data type with length/precision
  sql += getDataTypeSQL(column, engine);

  // Nullable
  sql += column.nullable ? ' NULL' : ' NOT NULL';

  // Default value
  if (column.defaultValue !== undefined && column.defaultValue !== '') {
    if (column.dataType === 'VARCHAR' || column.dataType === 'CHAR' || column.dataType === 'TEXT') {
      sql += ` DEFAULT '${column.defaultValue}'`;
    } else {
      sql += ` DEFAULT ${column.defaultValue}`;
    }
  }

  // Auto increment
  if (column.autoIncrement) {
    if (engine === 'mysql') {
      sql += ' AUTO_INCREMENT';
    } else if (engine === 'postgresql') {
      // PostgreSQL uses SERIAL types
      sql = sql.replace(/INT(EGER)?/, 'SERIAL');
    } else if (engine === 'sqlserver') {
      sql += ' IDENTITY(1,1)';
    }
  }

  // Primary key (for single column)
  if (column.primaryKey) {
    sql += ' PRIMARY KEY';
  }

  // Comment
  if (column.comment) {
    if (engine === 'mysql') {
      sql += ` COMMENT '${column.comment}'`;
    }
  }

  return sql;
};

const getDataTypeSQL = (column: DatabaseColumn, engine: DatabaseEngine): string => {
  let dataType = column.dataType;

  // Engine-specific type mappings
  if (engine === 'postgresql') {
    const pgMappings: Record<string, string> = {
      'TINYINT': 'SMALLINT',
      'LONGTEXT': 'TEXT',
      'DATETIME': 'TIMESTAMP',
      'BIT': 'BOOLEAN'
    };
    dataType = pgMappings[dataType] || dataType;
  } else if (engine === 'sqlserver') {
    const sqlServerMappings: Record<string, string> = {
      'TINYINT': 'TINYINT',
      'LONGTEXT': 'NVARCHAR(MAX)',
      'TEXT': 'NVARCHAR(MAX)',
      'DATETIME': 'DATETIME2',
      'BIT': 'BIT'
    };
    dataType = sqlServerMappings[dataType] || dataType;
  }

  // Add length/precision
  if (column.length && ['VARCHAR', 'CHAR', 'NVARCHAR', 'NCHAR'].includes(dataType)) {
    return `${dataType}(${column.length})`;
  }

  if (column.precision && column.scale !== undefined && dataType === 'DECIMAL') {
    return `${dataType}(${column.precision},${column.scale})`;
  }

  return dataType;
};

const generateForeignKeySQL = (
  relationship: any,
  sourceTableName: string,
  targetTableName: string,
  engine: DatabaseEngine
): string => {
  const sourceColumn = relationship.sourceColumn;
  const targetColumn = relationship.targetColumn;
  
  let sql = `ALTER TABLE ${sourceTableName} `;
  sql += `ADD CONSTRAINT fk_${sourceTableName}_${targetTableName} `;
  sql += `FOREIGN KEY (${sourceColumn}) `;
  sql += `REFERENCES ${targetTableName}(${targetColumn})`;
  
  if (relationship.onDelete !== 'NO_ACTION') {
    sql += ` ON DELETE ${relationship.onDelete.replace('_', ' ')}`;
  }
  
  if (relationship.onUpdate !== 'NO_ACTION') {
    sql += ` ON UPDATE ${relationship.onUpdate.replace('_', ' ')}`;
  }
  
  sql += ';';
  
  return sql;
};