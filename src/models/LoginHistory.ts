import { Model } from 'objection';

class LoginHistory extends Model {
  id!: number;
  user_id!: number;
  ip_address!: string;
  login_time!: Date;

  static get tableName() {
    return 'LoginHistory';
  }
}

export default LoginHistory;
