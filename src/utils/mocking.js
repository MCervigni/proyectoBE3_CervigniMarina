import { faker } from '@faker-js/faker';
import { createHash } from './index.js';

// Generar una mascota ficticia
export const generatePet = () => {
    const species = ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish'];
    
    return {
        name: faker.person.firstName(),
        specie: faker.helpers.arrayElement(species),
        birthDate: faker.date.past({ years: 10 }),
        adopted: false,
        image: faker.image.url()
    };
};

// Generar un usuario ficticio
export const generateUser = async () => {
    const roles = ['user', 'admin'];
    const first_name = faker.person.firstName();
    const last_name = faker.person.lastName();
    
    return {
        first_name,
        last_name,
        email: faker.internet.email({ firstName: first_name, lastName: last_name }),
        password: await createHash('coder123'),
        role: faker.helpers.arrayElement(roles),
        pets: []
    };
};

// Generar múltiples mascotas
export const generatePets = (count) => {
    const pets = [];
    for (let i = 0; i < count; i++) {
        pets.push(generatePet());
    }
    return pets;
};

// Generar múltiples usuarios
export const generateUsers = async (count) => {
    const users = [];
    for (let i = 0; i < count; i++) {
        const user = await generateUser();
        users.push(user);
    }
    return users;
};
