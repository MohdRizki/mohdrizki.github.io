import re

with open('src/pages/Dashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add imports
content = re.sub(
    r"import { db } from '\.\./firebase';",
    "import { db } from '../firebase';\nimport { collection, query, orderBy, getDocs, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';",
    content
)

# Replace .get() for collections
content = re.sub(
    r"db\.collection\('([^']+)'\)\.orderBy\('([^']+)',\s*'([^']+)'\)\.get\(\)",
    r"getDocs(query(collection(db, '\1'), orderBy('\2', '\3')))",
    content
)
content = re.sub(
    r"db\.collection\('([^']+)'\)\.get\(\)",
    r"getDocs(collection(db, '\1'))",
    content
)

# Replace .get() for docs
content = re.sub(
    r"db\.collection\('([^']+)'\)\.doc\('([^']+)'\)\.get\(\)",
    r"getDoc(doc(db, '\1', '\2'))",
    content
)

# Replace .set()
content = re.sub(
    r"db\.collection\('([^']+)'\)\.doc\('([^']+)'\)\.set\((.*?)\)",
    r"setDoc(doc(db, '\1', '\2'), \3)",
    content
)

# Replace .update()
content = re.sub(
    r"db\.collection\('([^']+)'\)\.doc\(([^)]+)\)\.update\((.*?)\)",
    r"updateDoc(doc(db, '\1', \2), \3)",
    content
)

# Replace .delete()
content = re.sub(
    r"db\.collection\('([^']+)'\)\.doc\(([^)]+)\)\.delete\(\)",
    r"deleteDoc(doc(db, '\1', \2))",
    content
)

# Replace .add()
content = re.sub(
    r"db\.collection\('([^']+)'\)\.add\((.*?)\)",
    r"addDoc(collection(db, '\1'), \2)",
    content
)

with open('src/pages/Dashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Dashboard.jsx updated.")
