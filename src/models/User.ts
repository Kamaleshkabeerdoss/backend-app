import { Model ,ModelObject,ToJsonOptions} from 'objection';

  class User extends Model {
  // static tableName = 'users';  
  id!: number;
  name!: string;
  email!: string;
  password!: string;
  age!: number;
  mobileNumber!: string;
  address!: string;
  gender!: string;
  dateOfBirth!: string;
  isDeleted!: boolean;
  role!: string;
  static get tableName() {
    return 'users';
  }
  // hide password in JSON response
  toJSON(opt?: ToJsonOptions): ModelObject<this> {
    const json = super.toJSON(opt);
    const jsonObj = json as any;

    delete jsonObj.password;

    return jsonObj;
  }
}

export default User ;
