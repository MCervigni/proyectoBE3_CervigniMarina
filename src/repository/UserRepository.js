
import GenericRepository from "./GenericRepository.js";

export default class UserRepository extends GenericRepository{
    constructor(dao){
        super(dao);
    }
    
    getUserByEmail = async (email) =>{
        return await this.getBy({email});
    }
    getUserById = async (id) =>{
        const user = await this.getBy({_id:id});
        return user || null;
    }
    
}