const express = require('express');
const path = require('path')
var cors = require('cors')
const app = express();
const jwt = require('jsonwebtoken');
const sendmail = require('sendmail')();
const nodemailer = require("nodemailer");
app.use(cors());
const body_parser = require('body-parser');
app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended: true
}));
var cron = require('node-cron');
var admin = require("firebase-admin");
var serviceAccount = require("./smarte-8f70f-firebase-adminsdk-dc8il-f047b8760f.json");
const { state } = require('@angular/animations');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smarte-8f70f.firebaseio.com"
});
var db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true })
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
})
app.use(express.static(path.join(__dirname, '/dist/SmartEM')));

app.get('/*', function(req, res) {

    res.sendFile(path.join(__dirname + '/dist/SmartEM/index.html'));
});

var transporter = nodemailer.createTransport({
    service: "FastMail",
    auth: {
        user: "smartem@fastmail.com",
        pass: "a2dy9uchfzhqnbs9"
    }
});
const accessTokenSecret = 'youraccesstokensecret';
const consumerTokenSecret = 'newtokenundreadable';
const verifyTokenSecret = 'verifyTokenSecret_174';
const adminTokenSecret = 'admin_admin@753';

cron.schedule('0 */1 * * *', () => {
    const todayAsTimestamp = admin.firestore.Timestamp.now()
    var d = new Date;
    d.setDate(d.getDate() - 1);
    d.setHours(00);
    d.setMinutes(00);
    d.setSeconds(00);
    var store = [];
    var data = [];
    var con = [];
    var state = 0;
    var d = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    const late = admin.firestore.Timestamp.fromDate(d);
    db.collection('Users').get()
        .then(function(q) {
            q.forEach(function(doc) {
                store.push(doc.data().username)
            });
            for (i = 0; i < store.length; i++) {
                let UserRef = db.collection('Consumption').where("date", "<=", todayAsTimestamp).where("date", ">=", late).where("consumerid", "==", store[i])
                UserRef.get()
                    .then(function(q) {
                        q.forEach(function(doc) {
                            if (doc.exists) {
                                data.push(doc.data().unit);
                                con.push(doc.data().consumerid);
                            }
                        });
                        today = data[data.length - 1] - data[0];
                        let LimitRef = db.collection('Limit').doc(con[0])
                        LimitRef.get().then((doc) => {
                            if (doc.exists) {
                                if (today > doc.data().limit && doc.data().limit != 0) {
                                    console.log("send");
                                    const mailOptions = {
                                        from: 'smartem@fastmail.com',
                                        to: doc.data().email,
                                        subject: 'Usage Warning',
                                        html: 'Hi, <br> Warning your daily usage exceeds<br> Thank you' // plain text body
                                    };
                                    transporter.sendMail(mailOptions, function(err, info) {});
                                }

                            }
                        }).catch((error) => {});
                        data = [];
                        con = [];
                    }).catch((error) => {});
            }

        });
});

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

function verifyUser(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401) // if there isn't any token

    jwt.verify(token, verifyTokenSecret, (err, user) => {
        if (err) return res.status(200).json({ "status": "0" })
        req.userid = user.userid;
        next();
    })
}

function adminToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, adminTokenSecret, (err, user) => {
        if (err) return res.status(200).json({ "status": "0" })
        req.admin = user.admin
        next()
    })
}

app.post('/api/admlogin', function(req, res) {
    var user = req.body.username;
    var pass = req.body.password;
    var status = 0;
    let UserRef = db.collection('Admin').where("username", "==", user).where("password", "==", pass);
    UserRef.get()
        .then(function(q) {
            q.forEach(function(doc) {
                if (doc.exists) {
                    const accessToken = jwt.sign({ admin: doc.data().username }, adminTokenSecret);
                    res.status(200).json({ "status": "1", "auth": accessToken })
                    status = 1
                }
            })
            if (status == 0) {
                res.status(200).json({ "status": "0" })
            }
        });
});
app.post("/api/adminInfo", adminToken, function(req, res) {
    let UserRef = db.collection('Admin').where("username", "==", req.admin);
    UserRef.get()
        .then(function(q) {
            q.forEach(function(doc) {
                if (doc.exists) {
                    res.status(200).json({ 'status': 1, 'name': doc.data().username });
                } else {
                    res.status(200).json({ 'status': 0, name: 'invalid user' });
                }
            });
        });
});

app.post("/api/BoardList", adminToken, function(req, res) {
    let UserRef = db.collection('BoardUsers');
    let Users = []
    UserRef.get()
        .then(function(q) {
            q.forEach(function(doc) {
                if (doc.exists) {
                    let use = { "name": doc.data().name, "user": doc.data().user }
                    Users.push(use);
                }
            });
            res.status(200).json({
                'status': 1,
                Users
            });
        });
});
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
    var username = String(req.body.username);
    var email = req.body.email;
    var phone = req.body.phone;
    let UserRef = db.collection("Users").where("username", "==", username)
    let state = 0;
    UserRef.get()
        .then(function(q) {
            q.forEach(function(doc) {
                state = 1;
            });
            if (state == 0) {
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
                    consumerid: username,
                });
                let accessToken = jwt.sign({ userid: username }, verifyTokenSecret);
                const mailOptions = {
                    from: 'smartem@fastmail.com', // sender address
                    to: email, // list of receivers
                    subject: 'Verify User', // Subject line
                    html: 'Hi, <br><p>Thank you for registering your account.<br>Please verify email and setup you account: https://smarte.herokuapp.com/verify?token=' + accessToken + '</p><br> Thank you' // plain text body
                };
                transporter.sendMail(mailOptions, function(err, info) {});
                res.status(200).json({ status: 1 });
            } else {
                res.status(200).json({ status: 0 });
            }
        });
});
app.post('/api/CreateUser', verifyUser, function(req, res) {
    var address = req.body.address;
    var city = req.body.city;
    var pincode = req.body.pincode;
    var password = req.body.password;
    try {
        let UserRef = db.collection('Users').where("username", "==", req.userid).where("status", "==", 0);
        UserRef.get()
            .then(function(q) {
                q.forEach(function(doc) {
                    if (doc.exists) {
                        db.collection('Users').doc(doc.id).set({
                            address: address,
                            city: city,
                            pincode: pincode,
                            password: password,
                            status: 1
                        }, { merge: true })
                    }
                });
                res.status(200).json({
                    'status': 1
                });
            });
    } catch (err) {
        res.status(200).json({
            'status': 0
        });
    }
});
app.post('/api/ConsumerUserInfo', authenticateToken, function(req, res) {
    let UserRef = db.collection('Users').where("board", "==", req.user).limit(10);
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
app.post('/api/ConsumersPending', authenticateToken, function(req, res) {
    let UserRef = db.collection('Users').where("board", "==", req.user).where("status", "==", 0);
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

    const mailOptions = {
        from: 'smartem@fastmail.com', // sender address
        to: 'jjose@cobaltcore.io', // list of receivers
        subject: 'Subject of your email', // Subject line
        html: '<p>Your html here</p>' // plain text body
    };
    transporter.sendMail(mailOptions, function(err, info) {});
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
    var unit = parseInt(req.body.unit);
    let status = 0
    db.collection("Users").where("username", "==", req.con).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                email = doc.data().email
            });
            let UserRef = db.collection('Limit').doc(req.con);
            UserRef.set({
                board: req.board,
                email: email,
                consumerid: req.con,
                limit: unit
            }, { merge: true });
        });

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
    var consumerid = String(req.body.consumerid);
    var unit = parseFloat(req.body.unit);
    var state = 0;
    var date = new Date(req.body.date);
    var todate = new Date(req.body.date);
    var condate = new Date(req.body.date);
    todate.setHours(00);
    todate.setMinutes(00);
    todate.setSeconds(00);
    condate.setDate(todate.getDate() - 1)
    const todayAsTimestamp = admin.firestore.Timestamp.fromDate(date)
    var yesterday = admin.firestore.Timestamp.fromDate(todate)
    var previous = admin.firestore.Timestamp.fromDate(condate)

    let UserRef = db.collection('Consumption').where("consumerid", "==", consumerid)
    UserRef.where("date", "<=", todayAsTimestamp).where("date", ">=", yesterday).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.exists) {
                    db.collection("Consumption").doc(doc.id).set({
                        unit: unit,
                        date: todayAsTimestamp,
                    }, { merge: true });
                }
                state = 1;
            });
            if (state == 0) {
                db.collection("Consumption").add({
                    board: board,
                    consumerid: consumerid,
                    unit: unit,
                    date: todayAsTimestamp,
                });
            }
        });
    db.collection('TodayGraph').where("date", "<", yesterday).get()
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
        date: todayAsTimestamp,
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
    d.setDate(d.getDate() - 2);
    d.setHours(00);
    d.setMinutes(00);
    d.setSeconds(00);
    var d = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    n = m.getDate()
    m.setHours(00);
    m.setMinutes(00);
    m.setDate(m.getDate() - n + 1);
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
            todayunit = storeday[storeday.length - 1] - storeday[storeday.length - 2];
            UserRef.where("date", "<=", todayAsTimestamp).where("date", ">=", month).orderBy("date").limit(1).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        lastm = doc.data().unit
                    });
                    monthunit = storeday[storeday.length - 1] - lastm;
                    db.collection("ConDashboard").where("consumerid", "==", req.con).get()
                        .then(function(q) {
                            q.forEach(function(doc) {
                                if (doc.exists) {
                                    db.collection('ConDashboard').doc(doc.id).set({
                                        today: todayunit,
                                        month: monthunit
                                    }, { merge: true })
                                }
                            });
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
    let UserRef = db.collection('Consumption').where("consumerid", "==", req.con).where("date", "<=", todayAsTimestamp).where("date", ">=", week)
    UserRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            localdate = doc.data().date.toDate().toDateString()
            store.push(doc.data().unit);
            let useme = { 'unit': doc.data().unit.toFixed(3), 'date': localdate }
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

app.post("/api/MonthlyChart", conAuth, function(req, res) {
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
    let UserRef = db.collection('Consumption').where("consumerid", "==", req.con).where("date", "<=", todayAsTimestamp).where("date", ">=", week).orderBy("date")
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

// app.post('/api/BillSlab', function(req, res) {
//     var data = req.body.data;
//     let UserRef = db.collection('Price').where("board", "==", "kalanjoor")
//     for(int i=0;i<data.length;i++){
//       UserRef..where("date", ">=", todate).get()
//           .then((querySnapshot) => {
//               querySnapshot.forEach((doc) => {
//                   if (doc.exists) {
//                       db.collection("Consumption").doc(doc.id).set({
//                           unit: unit,
//                           date: date,
//                       }, { merge: true });
//                   }
//                   state = 1;
//               });
//               if (state == 0) {
//                   db.collection("Consumption").add({
//                       board: board,
//                       consumerid: consumerid,
//                       unit: unit,
//                       date: date,
//                   });
//               }
//           });
//     }
//     res.status(200).json({ status: '1' })
// });
app.post('/api/MonthlyCharge', conAuth, function(req, res) {
    month = 0;
    db.collection("ConDashboard").where("consumerid", "==", req.con).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                month = doc.data().month
            });
            let PRef = db.collection("Price").where("from", "<=", month).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        price = doc.data().price;
                    });
                    fin = (month * price) + 30
                    res.status(200).json({ 'status': 1, 'charge': fin.toFixed(2) })

                });

        });
});

app.post('/api/IssueBill', authenticateToken, function(req, res) {
    var billfrom = new Date(req.body.billfrom);
    billfrom.setHours(12)
    var billto = new Date(req.body.billto);
    billto.setHours(23);
    billto.setMinutes(59);
    billto.setSeconds(59);
    var dDate = new Date(req.body.duedate);
    dDate.setHours(23);
    dDate.setMinutes(59);
    dDate.setSeconds(59);
    let BillRef = db.collection("Consumption")
    var users = [];
    var store = [];
    var n = 0;
    var d = new Date();
    var now = d.getTime();
    var billf = admin.firestore.Timestamp.fromDate(billfrom)
    var billt = admin.firestore.Timestamp.fromDate(billto)
    var duedate = admin.firestore.Timestamp.fromDate(dDate)
    db.collection('Users').where("board", "==", req.user).get()
        .then(function(q) {
            q.forEach(function(doc) {
                users.push(doc.data().username);
            });
            for (i = 0; i < users.length; i++) {
                con = users[i];
                BillRef.where("consumerid", "==", con).where("date", ">=", billf).where("date", "<=", billt).get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            bt = doc.data().unit
                            use = doc.data().consumerid;
                            store.push(bt)
                        });
                        if (store.length > 0) {
                            charges = 0;
                            charges = store[store.length - 1] - store[0];
                            let PRef = db.collection("Price").where("from", "<", charges).get()
                                .then((querySnapshot) => {
                                    querySnapshot.forEach((doc) => {
                                        price = doc.data().price;
                                    });
                                    fin = (charges * price) + 30
                                    db.collection("Bills").add({
                                        timestamp: now,
                                        billfrom: billf,
                                        billto: billt,
                                        duedate: duedate,
                                        charge: fin,
                                        consumed: charges,
                                        consumerid: use,
                                        board: req.user,
                                        state: false
                                    })
                                });
                        }
                        store = [];
                        con = "";
                    });
            }
        });
    db.collection("BillRecord").add({
        timestamp: now,
        billfrom: billf,
        billto: billt,
        board: req.user,
        duedate: duedate
    })

    res.status(200).json({ 'status': 1 })

});

app.post('/api/BillRecord', authenticateToken, function(req, res) {
    store = [];
    db.collection("BillRecord").where("board", "==", req.user).orderBy("duedate").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var billfrom = doc.data().billfrom.toDate().toDateString();
                var billto = doc.data().billto.toDate().toDateString();
                var duedate = doc.data().duedate.toDate().toDateString();
                var use = { 'billfrom': billfrom, 'billto': billto, 'duedate': duedate }
                store.push(use)
            });
            res.status(200).json({ 'record': store });

        });

});

app.post('/api/UserBills', conAuth, function(req, res) {
    store = [];
    db.collection("Bills").where("consumerid", "==", req.con).orderBy("duedate").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var billfrom = doc.data().billfrom.toDate().toDateString();
                var billto = doc.data().billto.toDate().toDateString();
                var duedate = doc.data().duedate.toDate().toDateString();
                var charge = doc.data().charge;
                var state = doc.data().state;
                var consumed = doc.data().consumed;
                var use = { 'billfrom': billfrom, 'billto': billto, 'duedate': duedate, 'charge': charge, 'state': state, 'consumed': consumed }
                store.push(use)

            });
            res.status(200).json({ 'record': store });

        });

});
app.post('/api/LastDueDate', conAuth, function(req, res) {
    store = []
    db.collection("Bills").where("consumerid", "==", req.con).orderBy("duedate").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                store.push(doc.data().duedate.toDate().toDateString());
            });
            res.status(200).json({ status: 1, "duedate": store[store.length - 1] })
        });
});

app.post('/api/SearchUser', authenticateToken, function(req, res) {
    var user = req.body.search;
    store = [];
    db.collection("Users").where("firstname", ">=", user).where("firstname", "<=", user).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                store.push({ "user": doc.data().username, "firstname": doc.data().firstname, "lastname": doc.data().lastname })
            });
            res.status(200).json({ status: 1, "users": store })
        });
});

app.post('/api/ProfileUser', authenticateToken, function(req, res) {
    var user = req.body.user;
    var userid = {}
    state = 0;
    try {
        db.collection("Users").where("board", "==", req.user).where("username", "<=", user).where("username", ">=", user).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    userid = {
                        "consumerid": doc.data().username,
                        "firstname": doc.data().firstname,
                        "lastname": doc.data().lastname,
                        "email": doc.data().email,
                        "phone": doc.data().phone,
                        "address": doc.data().address,
                        "city": doc.data().city,
                        "pincode": doc.data().pincode,
                    }
                    state = 1
                });
                userid['status'] = state;
                res.status(200).json(userid);
            });
    } catch (err) {
        res.status(200).json({ status: 0 });
    }
});

app.post('/api/UserConsumption', authenticateToken, function(req, res) {
    var user = req.body.user;
    var today = admin.firestore.Timestamp.now();
    var d = new Date();
    var mo = new Date()
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setDate(d.getDate() - 2);
    n = mo.getDate();
    lastd = 0;
    mo.setHours(00);
    mo.setDate(mo.getDate() - n + 1);
    var date = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    var m = new Date(mo.getTime() - mo.getTimezoneOffset() * 60000);
    var yesterday = admin.firestore.Timestamp.fromDate(date);
    var month = admin.firestore.Timestamp.fromDate(m);
    store = [];
    state = 0;
    let UserRef = db.collection("Consumption").where("board", "==", req.user).where("consumerid", "==", user)
    try {
        UserRef.where("date", "<=", today).where("date", ">=", yesterday).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    store.push(doc.data().unit)
                });
                daily = store[store.length - 1] - store[store.length - 2]
                UserRef.where("date", "<=", today).where("date", ">=", month).limit(1).get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            lastd = doc.data().unit;
                        });
                        month = store[store.length - 1] - lastd;
                        res.status(200).json({ status: 1, "daily": daily.toFixed(2), "month": month.toFixed(2), "reading": store[store.length - 1].toFixed(2) });
                    });
            });
    } catch (err) {
        res.status(200).json({ status: 0 });
    }
});

app.post('/api/LastBoard', authenticateToken, function(req, res) {
    var d = new Date();
    var n = d.getDate() + 1;
    var w = d.getDate() - 7;
    var qw = new Date();
    c = -1;
    var qe = new Date();
    while (w < n) {
        n--;
        qw.setDate(n);
        qw.setHours(23)
        qw.setMinutes(59)
        qw.setSeconds(59);
        qe.setHours(0);
        qe.setDate(n);
        qe.setMinutes(0);
        qe.setSeconds(0);
        var up = new Date(qw.getTime() - qw.getTimezoneOffset() * 60000);
        var down = new Date(qe.getTime() - qe.getTimezoneOffset() * 60000);
        var from = admin.firestore.Timestamp.fromDate(down);
        var to = admin.firestore.Timestamp.fromDate(up);
        storea = []
        var sum = 0;
        db.collection("Consumption").where("board", "==", req.user).where("date", "<=", to).where("date", ">=", from).get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    sum = sum + doc.data().unit
                    de = doc.data().date.toDate().toDateString();
                });
                c++;
                storea.push({ 'x': de, 'y': sum.toFixed(3) });
                sum = 0;
                if (storea.length == 8) {
                    sort = storea.sort(function(a, b) { return a.y - b.y })
                    res.status(200).json({ 'week': sort })
                }
            });
    }
});

app.post('/api/UsersTotal', authenticateToken, function(req, res) {
    c = 0;
    let UserRef = db.collection("Users").where("board", "==", req.user)
    UserRef.get().then(snap => {
        c = snap.size
        res.status(200).send({ userc: c });
    });
});
app.post('/api/UsersPending', authenticateToken, function(req, res) {
    c = 0;
    let UserRef = db.collection("Users").where("board", "==", req.user)
    UserRef.where("status", "==", 0).get().then(snap => {
        c = snap.size
        res.status(200).send({ userp: c });
    });
});
app.post('/api/LastDue', function(req, res) {
    c = 0;
    store = []
    today = admin.firestore.Timestamp.now();
    let UserRef = db.collection("BillRecord").where("board", "==", "kalanjoor")
    UserRef.orderBy("duedate").get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                store.push(doc.data().duedate.toDate().toDateString());
            });
            res.status(200).send({ lastdue: store[store.length - 1] });

        })

});

app.post('/api/RemoveCon', function(req, res) {
    let UserRef = db.collection('Consumption').where("board", "==", "kalanjoor").where("consumerid", "==", "4347387431");
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

app.listen(process.env.PORT || 3000);
