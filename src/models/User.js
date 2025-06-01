const { v4: uuidv4 } = require('uuid');
const docClient = require('../config/dynamodb');

const TABLE_NAME = 'Users';

class User {
    static async create(userData) {
        const user = {
            id: uuidv4(),
            ...userData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await docClient.put({
            TableName: TABLE_NAME,
            Item: user
        });

        return user;
    }

    static async findByEmail(email) {
        const result = await docClient.query({
            TableName: TABLE_NAME,
            IndexName: 'EmailIndex',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email
            }
        });

        return result.Items[0];
    }

    static async findById(id) {
        const result = await docClient.get({
            TableName: TABLE_NAME,
            Key: { id }
        });

        return result.Item;
    }

    static async update(id, updates) {
        const updateExpressions = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};

        Object.entries(updates).forEach(([key, value]) => {
            if (key !== 'id') {
                updateExpressions.push(`#${key} = :${key}`);
                expressionAttributeNames[`#${key}`] = key;
                expressionAttributeValues[`:${key}`] = value;
            }
        });

        updateExpressions.push('#updatedAt = :updatedAt');
        expressionAttributeNames['#updatedAt'] = 'updatedAt';
        expressionAttributeValues[':updatedAt'] = new Date().toISOString();

        const result = await docClient.update({
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: `SET ${updateExpressions.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        });

        return result.Attributes;
    }

    static async findAll() {
        const result = await docClient.scan({
            TableName: TABLE_NAME
        });

        return result.Items;
    }
}

module.exports = User; 