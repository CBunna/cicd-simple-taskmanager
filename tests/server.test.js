const request = require('supertest');
const app = require('../src/server');

describe('Task Manager API', () => {
    
    // Health Check Tests
    describe('GET /api/health', () => {
        it('should return healthy status', async () => {
            const response = await request(app).get('/api/health');
            
            expect(response.status).toBe(200);
            expect(response.body.status).toBe('healthy');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('uptime');
        });
    });

    // Get All Tasks Tests
    describe('GET /api/tasks', () => {
        it('should return all tasks', async () => {
            const response = await request(app).get('/api/tasks');
            
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    // Create Task Tests
    describe('POST /api/tasks', () => {
        it('should create a new task', async () => {
            const newTask = {
                title: 'Test Task'
            };
            
            const response = await request(app)
                .post('/api/tasks')
                .send(newTask);
            
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.title).toBe('Test Task');
            expect(response.body.completed).toBe(false);
        });

        it('should return 400 if title is missing', async () => {
            const response = await request(app)
                .post('/api/tasks')
                .send({});
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error');
        });

        it('should return 400 if title is empty', async () => {
            const response = await request(app)
                .post('/api/tasks')
                .send({ title: '   ' });
            
            expect(response.status).toBe(400);
        });
    });

    // Get Single Task Tests
    describe('GET /api/tasks/:id', () => {
        it('should return a specific task', async () => {
            const response = await request(app).get('/api/tasks/1');
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', 1);
        });

        it('should return 404 for non-existent task', async () => {
            const response = await request(app).get('/api/tasks/9999');
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
        });
    });

    // Update Task Tests
    describe('PUT /api/tasks/:id', () => {
        it('should update task completion status', async () => {
            const response = await request(app)
                .put('/api/tasks/1')
                .send({ completed: true });
            
            expect(response.status).toBe(200);
            expect(response.body.completed).toBe(true);
        });

        it('should update task title', async () => {
            const response = await request(app)
                .put('/api/tasks/1')
                .send({ title: 'Updated Title' });
            
            expect(response.status).toBe(200);
            expect(response.body.title).toBe('Updated Title');
        });

        it('should return 404 for non-existent task', async () => {
            const response = await request(app)
                .put('/api/tasks/9999')
                .send({ completed: true });
            
            expect(response.status).toBe(404);
        });
    });

    // Delete Task Tests
    describe('DELETE /api/tasks/:id', () => {
        it('should delete a task', async () => {
            const response = await request(app).delete('/api/tasks/3');
            
            expect(response.status).toBe(204);
        });

        it('should return 404 for non-existent task', async () => {
            const response = await request(app).delete('/api/tasks/9999');
            
            expect(response.status).toBe(404);
        });
    });

    // Statistics Tests
    describe('GET /api/stats', () => {
        it('should return task statistics', async () => {
            const response = await request(app).get('/api/stats');
            
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('total');
            expect(response.body).toHaveProperty('completed');
            expect(response.body).toHaveProperty('pending');
            expect(response.body).toHaveProperty('completionRate');
        });
    });

    // 404 Handler Test
    describe('404 Handler', () => {
        it('should return 404 for non-existent routes', async () => {
            const response = await request(app).get('/api/nonexistent');
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error');
        });
    });
});