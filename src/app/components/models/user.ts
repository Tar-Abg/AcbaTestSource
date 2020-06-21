export class User {
  id: number = null;
  name: string = null;
  username: string = null;
  email: string = null;
  phone: string = null;
  address: Address = new Address();
  website: string = null;
  company: Company = new Company();
}

class Address {
  street: string = '';
  suite: string = '';
  city: string = '';
  zipcode: string = ''
}
class Company {
  name: string = '';
  catchPhrase: string = '';
  bs: string = '';
}