import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { GlobalService } from 'app/global.service';

@Injectable()
export class StartupService {


    constructor(private http: Http) { }

    load(): Promise<any> {

        return new Promise((resolve: any) => {

            let v = Math.random();
            let jsonFileURL: string = "assets/appsettings.json?v=" + v;
            this.http.get(jsonFileURL)
                .map((res: Response) => res.json())
                .toPromise()
                .then((data: any) => {
                    console.log("StartupService", v, data)
                    return resolve(GlobalService.setAppsettings(data));
                })
                .catch((err: any) => {
                    console.log("StartupService", v, err);
                    Promise.reject(err);
                });
        });
    }



}
