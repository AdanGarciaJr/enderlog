jest.mock('prismarine-auth', () => ({
  Authflow: jest.fn().mockImplementation(() => ({
    getMinecraftJavaToken: jest.fn().mockResolvedValue({
      access_token: 'fake_access_token'
    })
  }))
}));

jest.mock('prismarine-realms', () => ({
  RealmAPI: {
    from: jest.fn(() => ({
      getRealms: jest.fn(() => Promise.resolve([{ id: 1 }])),
      getRealm: jest.fn(() => Promise.resolve({
        id: 1,
        name: 'Mock Realm',
        players: [{ uuid: 'mock-uuid' }]
      })),
    }))
  }
}));
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import { Authflow } from 'prismarine-auth';
import { RealmAPI } from 'prismarine-realms';
import app from './server.js'; // Make sure your server is exported as a module

describe('API Integration Tests', () => {
  it('should return 401 if not authenticated', async () => {
    const res = await request(app).get('/api/realms');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not authenticated/i);
  });

  jest.mock('prismarine-auth', () => ({
    Authflow: jest.fn().mockImplementation(() => ({
      getMinecraftJavaToken: jest.fn().mockResolvedValue({
        access_token: 'fake_token'
      })
    }))
  }));
  
  it('should login successfully and return success message', async () => {
    const res = await request(app).post('/api/login');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/logged in successfully/i);
  });

  it('should return realms data after login', async () => {
    await request(app).post('/api/login'); // simulate login
    const res = await request(app).get('/api/realms');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.realms).toHaveLength(1);
    expect(res.body.realms[0].name).toBe('Mock Realm');
  });

  it('should return JSON with success message on login', async () => {
    const res = await request(app).post('/api/login');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.message).toMatch(/logged in successfully/i);
  });
});