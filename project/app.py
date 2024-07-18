from flask import Flask, flash, redirect, render_template, request
from cs50 import SQL

app = Flask(__name__)

db = SQL("sqlite:///messages.db")

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/projects")
def projects():
    return render_template("projects.html")


@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        message = request.form.get("message")

        if name == "imbored":
            return render_template("easteregg.html")
        elif not name or not email or not message:
            return render_template("apology.html", message="Please fill out all the fields")
        elif len(message) > 1000:
            return render_template("apology.html", message="Message must be less than 1000 characters")
        elif "@" not in email or "." not in email or len(email) < 5 or len(email) > 100:
            return render_template("apology.html", message="Invalid email address")
        elif len(name) < 2 or len(name) > 100:
            return render_template("apology.html", message="Name must be between 2 and 100 characters")
        elif len(message) < 10:
            return render_template("apology.html", message="Message must be at least 10 characters long")

        try:
            db.execute("INSERT INTO messages (name, email, message) VALUES(?, ?, ?)", name, email, message)
        except:
            return render_template("apology.html", message="Something went wrong. Please try again")

        return redirect("/success")
    else:
        return render_template("contact.html")
    
@app.route("/apology")
def apology():
    return render_template("apology.html")


@app.route("/success")
def success():
    return render_template("success.html")


if __name__ == '__main__':
    app.run()