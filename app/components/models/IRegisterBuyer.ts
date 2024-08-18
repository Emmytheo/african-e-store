export interface RegisterBuyerRequest {
  email: string;
  password: string;
  fullname: string;
  confirmPassword: string;
  telephone: string;
  country: string;
  //   address: string;
  city: string;
  postCode: number;
  street: string;
}

export interface RegisterBuyerResponse {
  status: boolean;
  message: string;
  userId: string;
}

export interface LoginBuyer {
  email: string;
  password: string;
}