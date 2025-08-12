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

// Generar un usuario ficticio (versión simple como solicitas)
export const generateUser = async () => {
    let first_name = faker.person.firstName();
    let last_name = faker.person.lastName();
    let email = faker.internet.email({ firstName: first_name, lastName: last_name });
    let password = await createHash('coder123'); // Siempre "coder123" encriptada como se solicita
    
    const roles = ['user', 'admin'];
    
    return {
        first_name,
        last_name,
        email,
        password,
        role: faker.helpers.arrayElement(roles),
        pets: [] // Array vacío como se solicita
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
