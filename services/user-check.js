const csvFilePath = './data/userData.csv'
import csv from 'csvtojson'

export default class UserCheck {

    async isUserRegistered(userProfile) {
        csv()
            .fromFile(csvFilePath)
            .then((jsonObj) => {
                console.log(jsonObj.google_id);
            })
        const jsonArray = await csv().fromFile(csvFilePath).then();
        let isPresent = jsonArray.find((obj) => {
            return obj.google_id == userProfile
        })
        if (Object.keys(isPresent).length > 0) {
            return true
        } else {
            return false
        }
    }
}


