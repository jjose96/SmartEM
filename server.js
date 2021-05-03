const express = require('express');
const path = require('path')
var cors = require('cors')
const app = express();
const jwt = require('jsonwebtoken');
const sendmail = require('sendmail')();
app.use(cors());
const body_parser = require('body-parser');
app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended: true
}));
var admin = require("firebase-admin");
var serviceAccount = require("./smarte-8f70f-firebase-adminsdk-dc8il-f047b8760f.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarte-8f70f.firebaseio.com"
});
var db = admin.firestore();
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
})
app.use(express.static(path.join(__dirname, '/dist/SmartEM')));

app.get('/*', function(req, res) {

    res.sendFile(path.join(__dirname + '/dist/SmartEM/index.html'));
});


const accessTokenSecret = 'youraccesstokensecret';
const consumerTokenSecret = 'newtokenundreadable';

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) return res.status(200).json({ "status": "0" })
        req.user = user.board
        next()
    })
}

function conAuth(req, res, next) {
    // Gather the jwt access token from the request header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401) // if there isn't any token

    jwt.verify(token, consumerTokenSecret, (err, user) => {
        if (err) return res.status(200).json({ "status": "0" })
        req.con = user.consumerId;
        req.board = user.board;
        next()
    })
}

app.post('/api/blogin', function(req, res) {
    var user = req.body.username;
    var pass = req.body.password;
    var status = 0;
    let UserRef = db.collection('BoardUsers').where("user", "==", user).where("password", "==", pass);
    UserRef.get()
        .then(function(q) {
            q.forEach(function(doc) {
                if (doc.exists) {
                    const accessToken = jwt.sign({ board: doc.data().user }, accessTokenSecret);
                    res.status(200).json({ "status": "1", "auth": accessToken })
                    status = 1
                }
            })
            if (status == 0) {
                res.status(200).json({ "status": "0" })
            }
        });
});

app.post("/api/boardInfo", authenticateToken, function(req, res) {
    let UserRef = db.collection('BoardUsers').where("user", "==", req.user);
    UserRef.get()
        .then(function(q) {
            q.forEach(function(doc) {
                if (doc.exists) {
                    res.status(200).json({ 'status': 1, 'name': doc.data().name });
                } else {
                    res.status(200).json({ 'status': 0, name: 'invalid user' });
                }
            });
        });
});



app.post('/api/ConsumerReg', authenticateToken, function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var email = req.body.email;
    var phone = req.body.phone;
    db.collection("Users").add({
        firstname: firstname,
        lastname: lastname,
        username: username,
        email: email,
        phone: phone,
        board: req.user,
        status: 0
    });
    db.collection("ConDashboard").add({
        username: username,
    });

});

app.post('/api/ConsumerUserInfo', authenticateToken, function(req, res) {
    let UserRef = db.collection('Users').where("board", "==", req.user);
    let Users = []
    UserRef.get()
        .then(function(q) {
            q.forEach(function(doc) {
                if (doc.exists) {
                    let use = { "username": doc.data().username, "firstname": doc.data().firstname, "lastname": doc.data().lastname, "email": doc.data().email, "phone": doc.data().phone, "status": doc.data().status }
                    Users.push(use);
                }
            });
            res.status(200).json({
                'status': 1,
                Users
            });
        });

});


app.post('/api/RemoveConsumerUserInfo', authenticateToken, function(req, res) {
    var consId = req.body.consumedId;
    let UserRef = db.collection('Users').where("board", "==", req.user).where("username", "==", consId);
    UserRef.get()
        .then(function(q) {
            q.forEach(function(doc) {
                if (doc.exists) {
                    doc.ref.delete();
                }
            });
        });
    res.status(200).json({
        'status': 1
    });
});

app.post('/api/login', function(req, res) {
    var user = req.body.username;
    var pass = req.body.password;
    var status = 0;
    let UserRef = db.collection('Users').where("username", "==", user).where("password", "==", pass);
    UserRef.get()
        .then(function(q) {
            q.forEach(function(doc) {
                if (doc.exists) {
                    const accessToken = jwt.sign({ consumerId: doc.data().username, board: doc.data().board }, consumerTokenSecret);
                    res.status(200).json({ "status": "1", "auth": accessToken })
                    status = 1
                }
            })
            if (status == 0) {
                res.status(200).json({ "status": "0" })
            }
        });
});


app.post("/api/userInfo", conAuth, function(req, res) {
    let UserRef = db.collection('Users').where("username", "==", req.con);
    UserRef.get()
        .then(function(q) {
            q.forEach(function(doc) {
                if (doc.exists) {
                    res.status(200).json({ 'status': 1, 'firstname': doc.data().firstname, 'lastname': doc.data().lastname });
                } else {
                    res.status(200).json({ 'status': 0, name: 'invalid user' });
                }
            });
        });
});

app.post("/api/mail", function(req, res) {

    sendmail({
        from: 'test@finra.org',
        to: 'jekenod696@zcai55.com',
        subject: 'Hello World',
        html: 'Mail of test sendmail '
    }, function(err, reply) {
        console.log(err && err.stack)
        console.dir(reply)
    })
    res.status(200).json({ 'status': "success" })
});

app.post("/api/profileInfo", conAuth, function(req, res) {
    let UserRef = db.collection('Users').where("username", "==", req.con);
    UserRef.get()
        .then(function(q) {
            q.forEach(function(doc) {
                if (doc.exists) {
                    res.status(200).json({ 'consumerId': doc.data().username, 'firstname': doc.data().firstname, 'lastname': doc.data().lastname, 'email': doc.data().email, 'phone': doc.data().phone, 'address': doc.data().address, 'city': doc.data().city, 'pincode': doc.data().pincode });
                } else {
                    res.status(200).json({ 'status': 0, name: 'invalid user' });
                }
            });
        });
});
app.post('/api/ProfileUpdate', conAuth, function(req, res) {
    let UserRef = db.collection('Users').where("username", "==", req.con);
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var address = req.body.address
    var city = req.body.city
    var phone = req.body.phone;
    var pincode = req.body.pincode;
    UserRef.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                db.collection('Users').doc(doc.id).update({
                    firstname: firstname,
                    lastname: lastname,
                    address: address,
                    city: city,
                    pincode: pincode,
                    phone: phone,
                });
            });
        });
    res.status(200).json({ 'status': 1 });

});
app.post('/api/PasswordChange', conAuth, function(req, res) {
    var cpass = req.body.password;
    var npass = req.body.newpassword;
    let UserRef = db.collection('Users').where("username", "==", req.con).where("password", "==", cpass);
    UserRef.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                db.collection('Users').doc(doc.id).update({
                    password: npass
                });
            });
        });
    res.status(200).json({ 'status': 1 });

});

app.post('/api/SetLimit', conAuth, function(req, res) {
    var unit = req.body.unit;
    let status = 0
    let UserRef = db.collection('Limit').doc(req.con);
    UserRef.set({
        board: req.board,
        consumerid: req.con,
        limit: unit
    }, { merge: true });
    res.status(200).json({ 'status': 1 });
});
app.post('/api/GetLimit', conAuth, function(req, res) {
    var unit;
    let status = 0;
    let UserRef = db.collection('Limit').doc(req.con);
    UserRef.get().then((doc) => {
        if (doc.exists) {
            unit = doc.data().limit;
            res.status(200).json({ 'status': 1, 'unit': unit });
        } else {
            res.status(200).json({ 'status': 0 });
        }
    });
});
app.post('/api/ReadingStatus', function(req, res) {
    var board = req.body.board;
    var consumerid = req.body.consumerid;
    var unit = parseFloat(req.body.unit);
    var state = 0;
    var date = new Date(req.body.date);
    var todate = new Date(req.body.date);
    todate.setHours(00);
    todate.setMinutes(00);
    todate.setSeconds(00);
    let UserRef = db.collection('Consumption').where("consumerid", "==", "123456789")
    UserRef.where("date", "<=", date).where("date", ">=", todate).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.exists) {
                    db.collection("Consumption").doc(doc.id).set({
                        unit: unit,
                        date: date,
                    }, { merge: true });
                }
                state = 1;
            });
            if (state == 0) {
                db.collection("Consumption").add({
                    board: board,
                    consumerid: consumerid,
                    unit: unit,
                    date: date,
                });
            }
        });
    db.collection('TodayGraph').where("date", "<", todate).get()
        .then(function(q) {
            q.forEach(function(doc) {
                if (doc.exists) {
                    doc.ref.delete();
                }
            });
        });

    db.collection("TodayGraph").add({
        board: board,
        consumerid: consumerid,
        unit: unit,
        date: date,
    });
    res.status(200).json({ 'status': 1 });
});

app.post('/api/ConsumerDashboard', conAuth, function(req, res) {
    var yunit = 0;
    tunit = 0;
    var d = new Date;
    var m = new Date;
    let storeday = []
    let storemonth = []
    let todayunit;
    d.setDate(d.getDate() - 1);
    d.setHours(00);
    var d = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    n = m.getDate()
    m.setHours(00);
    m.setDate(m.getDate() - n);
    var m = new Date(m.getTime() - m.getTimezoneOffset() * 60000)
    const todayAsTimestamp = admin.firestore.Timestamp.now()
    var yesterday = admin.firestore.Timestamp.fromDate(d)
    var month = admin.firestore.Timestamp.fromDate(m)
    let UserRef = db.collection('Consumption').where("consumerid", "==", req.con)
    UserRef.where("date", "<=", todayAsTimestamp).where("date", ">=", yesterday).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                storeday.push(doc.data().unit)
            });
            todayunit = storeday[1] - storeday[0]
            db.collection("ConDashboard").where("consumerid", "==", req.con).get()
                .then(function(q) {
                    q.forEach(function(doc) {
                        if (doc.exists) {
                            db.collection('ConDashboard').doc(doc.id).set({
                                today: todayunit
                            }, { merge: true })
                        }
                    });
                });
        });
    UserRef.where("date", "<=", todayAsTimestamp).where("date", ">=", month).orderBy("date").limit(1).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                lastm = doc.data().unit
            });
            monthunit = storeday[1] - lastm;
            db.collection("ConDashboard").where("consumerid", "==", req.con).get()
                .then(function(q) {
                    q.forEach(function(doc) {
                        if (doc.exists) {
                            db.collection('ConDashboard').doc(doc.id).set({
                                month: monthunit
                            }, { merge: true })
                        }
                    });
                });


        });

    db.collection("ConDashboard").where("consumerid", "==", req.con).get()
        .then(function(q) {
            q.forEach(function(doc) {
                if (doc.exists) {
                    today = doc.data().today.toFixed(2);
                    month = doc.data().month.toFixed(2);
                }
            });
            res.status(200).json({ 'status': 1, 'today': today, 'month': month });
        });
});

app.post('/api/Last7Days', conAuth, function(req, res) {
    var d = new Date();
    var d = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    d.setHours(00);
    d.setMinutes(00);
    d.setDate(d.getDate() - 8);
    let Weekdata = []
    let store = []
    let finals = []
    let n = 0;
    const todayAsTimestamp = admin.firestore.Timestamp.now()
    var week = admin.firestore.Timestamp.fromDate(d)
    let UserRef = db.collection('Consumption').where("consumerid", "==", req.con).where("date", "<=", todayAsTimestamp).where("date", ">=", week).orderBy("date")
    UserRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            localdate = doc.data().date.toDate().toDateString()
            store.push(doc.data().unit);
            let useme = { 'unit': doc.data().unit, 'date': localdate }
            Weekdata.push(useme)
        });
        try {
            while (n < 8) {
                c = store[n + 1] - store[n]
                p = Weekdata[n + 1]['tunit'] = c.toFixed(2);
                n = n + 1
                if (n > 8) {
                    break;
                }
            }
        } catch (err) {}
        Weekdata.splice(0, 1);

        res.status(200).json({ 'status': 1, 'week': Weekdata });

    });
});

app.post("/api/DailyChart", conAuth, function(req, res) {
    var today = admin.firestore.Timestamp.now();
    var store = []
    var record = []
    n = 0
    let UserRef = db.collection('TodayGraph').where("consumerid", "==", req.con)
    UserRef.where("date", "<=", today).get()
        .then(function(q) {
            q.forEach(function(doc) {
                localdate = doc.data().date.toDate().toLocaleTimeString();
                let use = { x: localdate }
                store.push(doc.data().unit);
                record.push(use);
            });
            while (n < store.length) {
                if (typeof store[n + 1] === "undefined") {
                    store[n + 1] = store[n]
                }
                if (typeof record[n + 1] === "undefined") {
                    break;
                }

                c = store[n + 1] - store[n]
                p = record[n + 1]['y'] = c.toFixed(2);
                n = n + 1
                if (n > store.length) {
                    break;
                }
            }
            record.splice(0, 1);
            res.status(200).json({ 'status': 1, 'units': record })
        });
});

app.post("/api/WeeklyChart", conAuth, function(req, res) {
    var d = new Date();
    var d = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    d.setHours(00);
    d.setMinutes(00);
    d.setDate(d.getDate() - 8);
    let Weekdata = []
    let store = []
    let finals = []
    let n = 0;
    const todayAsTimestamp = admin.firestore.Timestamp.now()
    var week = admin.firestore.Timestamp.fromDate(d)
    let UserRef = db.collection('Consumption').where("consumerid", "==", req.con).where("date", "<=", todayAsTimestamp).where("date", ">=", week).orderBy("date")
    UserRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            localdate = doc.data().date.toDate().toDateString()
            store.push(doc.data().unit);
            let useme = { x: localdate }
            Weekdata.push(useme)
        });
        try {
            while (n < 8) {
                c = store[n + 1] - store[n]
                p = Weekdata[n + 1]['y'] = c.toFixed(2);
                n = n + 1
                if (n > 8) {
                    break;
                }
            }
        } catch (err) {}
        Weekdata.splice(0, 1);

        res.status(200).json({ 'status': 1, 'week': Weekdata });

    });
});

app.post("/api/MonthlyChart", function(req, res) {
    var d = new Date();
    var d = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    d.setHours(00);
    d.setMinutes(00);
    d.setDate(d.getDate() - 32);
    let Weekdata = []
    let store = []
    let finals = []
    let n = 0;
    const todayAsTimestamp = admin.firestore.Timestamp.now()
    var week = admin.firestore.Timestamp.fromDate(d)
    let UserRef = db.collection('Consumption').where("consumerid", "==", "123456789").where("date", "<=", todayAsTimestamp).where("date", ">=", week).orderBy("date")
    UserRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            localdate = doc.data().date.toDate().toDateString()
            store.push(doc.data().unit);
            let useme = { x: localdate }
            Weekdata.push(useme)
        });
        try {
            while (n < 32) {
                c = store[n + 1] - store[n]
                p = Weekdata[n + 1]['y'] = c.toFixed(2);
                n = n + 1
                if (n > 32) {
                    break;
                }
            }
        } catch (err) {}
        Weekdata.splice(0, 1);

        res.status(200).json({ 'status': 1, 'month': Weekdata });

    });
});
app.post('/api/Date', function(req, res) {
    const v = new Date()
    v.setHours(0)
    console.log(v);
    var d = new Date(v.getTime() - v.getTimezoneOffset() * 60000)
    res.status(200).json({ 'status': 1, 'date': d })
});
app.listen(process.env.PORT || 3000);
