export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Url {
  _id: string;
  code:string;
  userId:string;
  longUrl:string;
  clicks:number;
  clickLogs: {
    _id:string;
    timeStamp: string;
    ip: string;
  }[];

  createdAt:string;
  expiresAt:string | null;
}

export interface Analytics{
    code:string,
    shortUrl:string,
    longUrl:string,
    totalClicks:number,
    last7Days:{
        date:string;
        clicks:number;
    }[];
    createdAt:string;
    expiresAt:string | null;
    topIps:{
        ip:string;
        count:number;
    }[];
}

export interface Pagination{
    currentPage:number;
    totalPages:number;
    hasNextPage:boolean;
    hasPrevPage:boolean;
}


export interface AuthState{
    user:{
        name:string;
        email:string;
    } | null;
    accessToken: string | null;
    isAuthenticated:boolean
}