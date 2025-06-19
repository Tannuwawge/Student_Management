const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();
const tanushree = express();

tanushree.use(cors({origin: true}));
tanushree.use(express.json());

function computeResults(student) {
  const total = student.phy + student.chem + student.math;
  const per = total / 3;
  const grade = per >= 90 ? "A" : per >= 75 ? "B" : per >= 60 ? "C" : "D";
  return {...student, total, per, grade};
}

// Add student
tanushree.post("/student", async (req, res) => {
  try {
    const data = computeResults(req.body);
    const docRef = db.collection("studentsData").doc(data.email);
    await docRef.set(data);
    res.status(201).send({ message: "Student added", email: data.email });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error adding student" });
  }
});

// Get all students
tanushree.get("/students", async (req, res) => {
  try {
    const snapshot = await db.collection("studentsData").get();
    const students = snapshot.docs.map((doc) => doc.data());
    res.send(students);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error getting students" });
  }
});

// Get student by email
tanushree.get("/student/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const doc = await db.collection("studentsData").doc(email).get();
    if (!doc.exists) return res.status(404).send({ error: "Student not found" });
    res.send(doc.data());
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error fetching student" });
  }
});

// Update student
tanushree.put("/student/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const data = computeResults(req.body);
    await db.collection("studentsData").doc(email).set(data, { merge: true });
    res.send({ message: "Student updated", email });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error updating student" });
  }
});


// Delete student
tanushree.delete("/student/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const docRef = db.collection("studentsData").doc(email);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).send({ error: "Student not found" });
    await docRef.delete();
    res.send({ message: "Student deleted", email });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error deleting student" });
  }
});


// ✅ Register user
tanushree.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({ error: "Name, email, and password are required" });
    }

    // Optional: Hash password here before saving to Firestore (for real apps)

    const userDoc = {
      name,
      email,
      password, // In production, store only hashed password!
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Save user by email as doc ID (or use auto ID: db.collection("users").add(userDoc))
    const docRef = db.collection("studentsData").doc(email);
    await docRef.set(userDoc);

    res.status(201).send({ message: "User registered successfully", email });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send({ error: "Registration failed" });
  }
});


// ✅ Login: Check user auth
tanushree.post("/login", async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).send({error: "Email and password are required"});
    }

    const docRef = db.collection("studentsData").doc(email);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({success: false, message: "User not found"});
    }

    const userData = doc.data();

    if (userData.password === password) {
      res.send({success: true, message: "Authentication successful"});
    } else {
      res.send({success: false, message: "Invalid password"});
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send({success: false, error: "Login failed"});
  }
});

// ✅ Make admin
tanushree.put("/make-admin", async (req, res) => {
  const {superEmail, superPassword, email} = req.body;

  if (!superEmail || !superPassword || !email) {
    return res.status(400).json({
      message: "Missing fields",
      error: "Please provide superEmail, superPassword, and email",
    });
  }

  try {
    const superDoc = await db.collection("studentsData").doc("superadmin@gmail.com").get();

    if (!superDoc.exists) {
      return res.status(404).json({
        message: "Superadmin not found",
        error: "Superadmin document does not exist",
      });
    }

    const superData = superDoc.data();

    if (
      superData.superEmail !== superEmail ||
      superData.superPassword !== superPassword ||
      superData.Role !== "superadmin"
    ) {
      return res.status(403).json({
        message: "Invalid superadmin credentials",
        error: "Authentication failed for superadmin",
      });
    }

    const studentSnapshot = await db
      .collection("studentsData")
      .where("email", "==", email)
      .get();

    if (studentSnapshot.empty) {
      return res.status(404).json({
        message: "Student not found",
        error: "No student found with the provided email",
      });
    }

    const studentDoc = studentSnapshot.docs[0];
    await db.collection("studentsData").doc(studentDoc.id).update({
      Role: "admin",
    });

    res.status(200).json({
      message: "Student successfully promoted to admin.",
    });
  } catch (err) {
    console.error("Error promoting student to admin:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

// ✅ Make student
tanushree.put("/make-student", async (req, res) => {
  const {superEmail, superPassword, email} = req.body;

  if (!superEmail || !superPassword || !email) {
    return res.status(400).json({
      message: "Missing fields",
      error: "Please provide superEmail, superPassword, and email",
    });
  }

  try {
    const superDoc = await db.collection("studentsData").doc("superadmin@gmail.com").get();

    if (!superDoc.exists) {
      return res.status(404).json({
        message: "Superadmin not found",
        error: "Superadmin document does not exist",
      });
    }

    const superData = superDoc.data();

    if (
      superData.superEmail !== superEmail ||
      superData.superPassword !== superPassword ||
      superData.Role !== "superadmin"
    ) {
      return res.status(403).json({
        message: "Invalid superadmin credentials",
        error: "Authentication failed for superadmin",
      });
    }

    const studentSnapshot = await db
      .collection("studentsData")
      .where("email", "==", email)
      .get();

    if (studentSnapshot.empty) {
      return res.status(404).json({
        message: "Student not found",
        error: "No admin found with the provided email",
      });
    }

    const studentDoc = studentSnapshot.docs[0];
    await db.collection("studentsData").doc(studentDoc.id).update({
      Role: "student",
    });

    res.status(200).json({
      message: "Admin successfully demoted to student.",
    });
  } catch (err) {
    console.error("Error demoting admin to student:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

// ✅ Get all registered users (Optional)
tanushree.get("/users", async (req, res) => {
  try {
    const snapshot = await db.collection("usersLogin").get();
    const users = snapshot.docs.map((doc) => doc.data());
    res.send(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send({error: "Error getting users"});
  }
});

// ✅ Get role of the logged-in user by email
tanushree.get("/role/:email", async (req, res) => {
  try {
    const email = req.params.email;

    if (!email) {
      return res.status(400).send({error: "Email is required"});
    }

    const docRef = db.collection("studentsData").doc(email);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({error: "User not found"});
    }

    const userData = doc.data();

    res.send({
      email: email,
      role: userData.Role || "student", // Default to student if role is missing
    });
  } catch (err) {
    console.error("Error fetching role:", err);
    res.status(500).send({error: "Failed to fetch role"});
  }
});

// ✅ Change password route
tanushree.post("/change-password", async (req, res) => {
  try {
    const {email, oldPassword, newPassword} = req.body;

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({error: "Email, old password, and new password are required"});
    }

    const userDocRef = db.collection("studentsData").doc(email);
    const userSnapshot = await userDocRef.get();

    if (!userSnapshot.exists) {
      return res.status(404).json({error: "User not found"});
    }

    const userData = userSnapshot.data();

    // Check old password
    if (userData.password !== oldPassword) {
      return res.status(401).json({error: "Old password is incorrect"});
    }

    // Update to new password
    await userDocRef.update({
      password: newPassword,
      passwordUpdatedAt: admin.firestore.FieldValue.serverTimestamp(), // optional
    });

    res.status(200).json({message: "Password changed successfully"});
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({error: "Failed to change password"});
  }
});

// ✅ Get Admins
tanushree.get("/admins", async (req, res) => {
  try {
    const snapshot = await db
      .collection("studentsData")
      .where("Role", "==", "admin")
      .get();

    if (snapshot.empty) {
      return res.status(404).json({message: "No admins found"});
    }

    const admins = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({error: "Failed to fetch admins"});
  }
});

tanushree.post("/complaints", async (req, res) => {
  const { email, complaint } = req.body;

  if (!email || !complaint) {
    return res.status(400).json({ error: "Email and complaint are required." });
  }

  try {
    const data = {
      email,
      complaint,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };
    const docRef = await db.collection("complaints").add(data);
    res.status(201).json({ message: "Complaint submitted", id: docRef.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit complaint" });
  }
});

tanushree.get("/complaints", async (req, res) => {
  const role = req.headers.role;

  if (role !== "admin" && role !== "superadmin") {
    return res.status(403).json({ error: "Unauthorized access" });
  }

  try {
    const snapshot = await db.collection("complaints").orderBy("timestamp", "desc").get();
    const complaints = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(complaints);
  } catch (err) {
    res.status(500).json({ error: "Error fetching complaints" });
  }
});

// ✅ Test route
tanushree.get("/hello", (req, res) => {
  res.send("working");
});

// ✅ Export the Express tanushri as Firebase Function
exports.api = functions.https.onRequest(tanushree);