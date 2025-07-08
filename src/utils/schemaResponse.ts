import {Type} from "@google/genai";

export const responseSchema = {
    type: Type.OBJECT,
    properties: {

        database: {

            type: Type.OBJECT,

            properties: {

                name: {

                    type: Type.STRING,

                },

                engine: {

                    type: Type.STRING,

                    enum: ['mysql', 'postgresql', 'sqlserver'],

                },

                tables: {

                    type: Type.ARRAY,

                    items: {

                        type: Type.OBJECT,

                        properties: {

                            id: {

                                type: Type.STRING,

                            },

                            name: {

                                type: Type.STRING,

                            },

                            description: {

                                type: Type.STRING,

                            },

                            position: {

                                type: Type.OBJECT,

                                properties: {

                                    x: {

                                        type: Type.NUMBER,

                                    },

                                    y: {

                                        type: Type.NUMBER,

                                    },

                                },

                                propertyOrdering: ["x", "y"],

                            },

                            columns: {

                                type: Type.ARRAY,

                                items: {

                                    type: Type.OBJECT,

                                    properties: {

                                        id: {

                                            type: Type.STRING,

                                        },

                                        name: {

                                            type: Type.STRING,

                                        },

                                        dataType: {

                                            type: Type.STRING,

                                            enum: [

                                                'VARCHAR', 'CHAR', 'TEXT', 'LONGTEXT',

                                                'INT', 'BIGINT', 'SMALLINT', 'TINYINT',

                                                'DECIMAL', 'FLOAT', 'DOUBLE',

                                                'DATE', 'DATETIME', 'TIMESTAMP', 'TIME',

                                                'BOOLEAN', 'BIT',

                                                'JSON', 'BLOB', 'BINARY', 'ENUM'

                                            ],

                                        },

                                        length: {

                                            type: Type.NUMBER,

                                        },

                                        precision: {

                                            type: Type.NUMBER,

                                        },

                                        scale: {

                                            type: Type.NUMBER,

                                        },

                                        values: {

                                            type: Type.ARRAY,

                                            items: {

                                                type: Type.STRING,

                                            },

                                        },

                                        nullable: {

                                            type: Type.BOOLEAN,

                                        },

                                        default: {

                                            type: Type.STRING,

                                        },

                                        autoIncrement: {

                                            type: Type.BOOLEAN,

                                        },

                                        primaryKey: {

                                            type: Type.BOOLEAN,

                                        },

                                        unique: {

                                            type: Type.BOOLEAN,

                                        },

                                        index: {

                                            type: Type.BOOLEAN,

                                        },

                                        comment: {

                                            type: Type.STRING,

                                        },

                                    },

                                    propertyOrdering: [

                                        "id", "name", "dataType", "length", "precision", "scale", "values",

                                        "nullable", "default", "autoIncrement", "primaryKey",

                                        "unique", "index", "comment"

                                    ],

                                },

                            },

                            indexes: {

                                type: Type.ARRAY,

                                items: {

                                    type: Type.OBJECT,

                                    properties: {

                                        id: {

                                            type: Type.STRING,

                                        },

                                        name: {

                                            type: Type.STRING,

                                        },

                                        type: {

                                            type: Type.STRING,

                                            enum: ['INDEX', 'UNIQUE', 'PRIMARY'],

                                        },

                                        columns: {

                                            type: Type.ARRAY,

                                            items: {

                                                type: Type.STRING,

                                            },

                                        },

                                        unique: {

                                            type: Type.BOOLEAN,

                                        },

                                    },

                                    propertyOrdering: ["id", "name", "type", "columns", "unique"],

                                },

                            },

                        },

                        propertyOrdering: ["id", "name", "description", "position", "columns", "indexes"],

                    },

                },

                relationships: {

                    type: Type.ARRAY,

                    items: {

                        type: Type.OBJECT,

                        properties: {

                            id: {

                                type: Type.STRING,

                            },

                            name: {

                                type: Type.STRING,

                            },

                            type: {

                                type: Type.STRING,

                                enum: ['ONE_TO_ONE', 'ONE_TO_MANY', 'MANY_TO_ONE', 'MANY_TO_MANY'],

                            },

                            sourceTable: {

                                type: Type.STRING,

                                description: "Table ID that contains the foreign key",

                            },

                            sourceColumn: {

                                type: Type.STRING,

                                description: "Column ID that serves as the foreign key",

                            },

                            targetTable: {

                                type: Type.STRING,

                                description: "Table ID that is being referenced",

                            },

                            targetColumn: {

                                type: Type.STRING,

                                description: "Column ID that is being referenced",

                            },

                            onDelete: {

                                type: Type.STRING,

                                enum: ['CASCADE', 'SET_NULL', 'RESTRICT', 'NO_ACTION'],

                            },

                            onUpdate: {

                                type: Type.STRING,

                                enum: ['CASCADE', 'SET_NULL', 'RESTRICT', 'NO_ACTION'],

                            },

                        },

                        propertyOrdering: [

                            "id", "name", "type", "sourceTable", "sourceColumn",

                            "targetTable", "targetColumn", "onDelete", "onUpdate"

                        ],

                    },

                },

            },

            propertyOrdering: ["name", "engine", "tables", "relationships"],

        },

        selectedTableId: {

            type: Type.STRING,

        },

        selectedColumnId: {

            type: Type.STRING,

        },

    },

    propertyOrdering: ["database", "selectedTableId", "selectedColumnId"],

};