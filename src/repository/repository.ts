import { Model } from "../model/model";

import { Res } from "../response";

export interface Repository<T> {
    model: Model<T>
    res: Res
}