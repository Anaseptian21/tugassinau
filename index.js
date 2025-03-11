const fs = require("fs");
const readline = require("readline-sync");
const notifier = require("node-notifier");
const path = "todos.json";

// Load data
function loadTodos() {
    return fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : [];
}

// Simpan data
function saveTodos(todos) {
    fs.writeFileSync(path, JSON.stringify(todos, null, 2));
}

// Tampilkan menu utama
function showMenu() {
    console.log("\n====ANA WORK ====");
    console.log("1. Tambah Tugas");
    console.log("2. Lihat Tugas");
    console.log("3. Tandai Selesai");
    console.log("4. Hapus Tugas");
    console.log("5. Atur Prioritas");
    console.log("6. Set Tenggat Waktu");
    console.log("7. Keluar");

    let choice = readline.question("Pilih menu: ");
    switch (choice) {
        case "1": addTodo(); break;
        case "2": listTodos(); break;
        case "3": markTodo(); break;
        case "4": deleteTodo(); break;
        case "5": setPriority(); break;
        case "6": setDeadline(); break;
        case "7": console.log("Terima kasih! 👋"); process.exit();
        default: console.log("Pilihan tidak valid!"); showMenu();
    }
}

// Tambah tugas
function addTodo() {
    let task = readline.question("Masukkan tugas: ");
    let priority = readline.question("Prioritas (Low/Medium/High): ", { defaultInput: "Medium" });
    
    let todos = loadTodos();
    todos.push({ task, completed: false, priority, deadline: null });
    saveTodos(todos);
    
    console.log("✅ Tugas berhasil ditambahkan!");
    showMenu();
}

// Lihat tugas
function listTodos() {
    let todos = loadTodos();
    console.log("\n=== 📋 Daftar Tugas ===");
    if (todos.length === 0) return console.log("Tidak ada tugas.\n"), showMenu();

    todos.forEach((todo, index) => {
        let status = todo.completed ? "[✓]" : "[ ]";
        console.log(`${index + 1}. ${status} ${todo.task} | Prioritas: ${todo.priority} | Tenggat: ${todo.deadline || "Belum ditentukan"}`);
    });
    showMenu();
}

// Tandai tugas selesai
function markTodo() {
    let todos = loadTodos();
    let index = parseInt(readline.question("Masukkan nomor tugas yang selesai: ")) - 1;
    
    if (index >= 0 && index < todos.length) {
        todos[index].completed = !todos[index].completed;
        saveTodos(todos);
        console.log(`✅ Tugas '${todos[index].task}' ${todos[index].completed ? "selesai" : "dibuka kembali"}`);
    } else {
        console.log("❌ Nomor tugas tidak valid!");
    }
    showMenu();
}

// Hapus tugas
function deleteTodo() {
    let todos = loadTodos();
    let index = parseInt(readline.question("Masukkan nomor tugas yang dihapus: ")) - 1;

    if (index >= 0 && index < todos.length) {
        console.log(`🗑️ Menghapus tugas: '${todos[index].task}'`);
        todos.splice(index, 1);
        saveTodos(todos);
    } else {
        console.log("❌ Nomor tugas tidak valid!");
    }
    showMenu();
}

// Atur prioritas tugas
function setPriority() {
    let todos = loadTodos();
    let index = parseInt(readline.question("Pilih nomor tugas: ")) - 1;

    if (index >= 0 && index < todos.length) {
        let priority = readline.question("Set prioritas (Low/Medium/High): ");
        todos[index].priority = priority;
        saveTodos(todos);
        console.log("⚡ Prioritas berhasil diperbarui!");
    } else {
        console.log("❌ Nomor tugas tidak valid!");
    }
    showMenu();
}

// Atur tenggat waktu
function setDeadline() {
    let todos = loadTodos();
    let index = parseInt(readline.question("Pilih nomor tugas: ")) - 1;

    if (index >= 0 && index < todos.length) {
        let deadline = readline.question("Masukkan tenggat waktu (YYYY-MM-DD): ");
        todos[index].deadline = deadline;
        saveTodos(todos);
        console.log("⏳ Tenggat waktu telah ditetapkan!");

        // Notifikasi Pengingat
        setTimeout(() => {
            notifier.notify({
                title: "🚀 Ana Work Reminder!",
                message: `Tugas '${todos[index].task}' harus selesai sebelum ${deadline}!`,
                sound: true
            });
        }, 5000);
    } else {
        console.log("❌ Nomor tugas tidak valid!");
    }
    showMenu();
}

// Jalankan aplikasi
showMenu();
