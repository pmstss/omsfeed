import { NextFunction, Request, Response } from 'express';
import * as moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD';

export class ParametersValidator {
    static validateDate(dateStr: string): boolean {
        const m = moment(dateStr, DATE_FORMAT);
        if (m == null || !m.isValid()) {
            return false;
        }
        return dateStr === m.format(DATE_FORMAT);
    }

    static validate(req: Request, res: Response, next: NextFunction): void {
        if (req.params.asset && !['au', 'ag', 'pt', 'pd'].includes(req.params.asset)) {
            res.status(422).send('Unsupported asset; use au, ag, pt, pd');
        } else {
            ['date', 'startDate', 'endDate'].forEach((dateParam) => {
                if (req.query[dateParam] &&
                        !ParametersValidator.validateDate(req.query[dateParam])) {
                    res.status(422).send('Unsupported date format; use YYYY-MM-DD');
                }
            });
        }

        if (!res.headersSent) {
            next();
        }
    }
}
