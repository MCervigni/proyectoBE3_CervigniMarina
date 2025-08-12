import { faker } from '@faker-js/faker';
import { createHash } from '../utils/index.js';

export default class MockingDAO {
    
    generateMockPet = () => {
        const species = ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'fish'];
        
        return {
            name: faker.person.firstName(),
            specie: faker.helpers.arrayElement(species),
            birthDate: faker.date.past({ years: 10 }),
            adopted: false,
            image: faker.image.url()
        };
    };

    generateMockUser = async () => {
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

    generateMultiplePets = (count) => {
        const pets = [];
        for (let i = 0; i < count; i++) {
            pets.push(this.generateMockPet());
        }
        return pets;
    };

    generateMultipleUsers = async (count) => {
        const users = [];
        for (let i = 0; i < count; i++) {
            const user = await this.generateMockUser();
            users.push(user);
        }
        return users;
    };
}
