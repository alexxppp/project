import os
from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required, lookup, usd

# Configure application
app = Flask(__name__)

# Custom filter
app.jinja_env.filters["usd"] = usd

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///finance.db")


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    """Show portfolio of stocks"""
    # MINE: CREATES A DICTIONARY WITH THE SYMBOLS AND SHARES OF SAID USER (WITH NO DUPLICATES)
    owned = db.execute(
        "SELECT  symbol, sum(shares) as shares FROM owned_stocks WHERE user_id = ? GROUP BY symbol", session["user_id"])
    # MINE: ADDS THE SINGULAR AND TOTAL PRICE OF STOCK TO OWNED DICTIONARY
    for stock in owned:
        stock_info = lookup(stock['symbol'])
        stock['price_per_share'] = stock_info['price']
        stock['total_value'] = stock['shares'] * stock_info['price']

    # MINE: LOOKS UP THE CURRENT CASH AND CURRENT TOTAL NETWORTH OF THE USER
    current_cash = float(db.execute(
        "SELECT cash FROM users WHERE id = ?", session["user_id"])[0]['cash'])
    total_networth = current_cash
    for stock in owned:
        total_networth += float(stock['total_value'])

    return render_template("index.html", owned=owned, current_cash=current_cash, total_networth=total_networth)


@app.route("/buy", methods=["GET", "POST"])
@login_required
def buy():
    """Buy shares of stock"""
    if request.method == "POST":
        symbol = request.form.get("symbol").upper()
        # MINE: CHECKS ALL POSSIBILITIES WITH BUYING INPUTS
        # (IF IT'S EMPTY, IF SHARES ARE 0, IF ENOUGH CASH IS AVAILABLE, IF SHARES IS INTEGER)
        if not symbol:
            return apology("missing symbol", 400)
        elif not lookup(symbol):
            return apology("symbol not found", 400)

        price_per_share = lookup(symbol)["price"]
        # MINE: CHECKS IF SHARES INPUT IS INTEGER NAD MOVES ON TO CHECKING IF USER HAS ENOUGH CASH
        try:
            shares = int(request.form.get("shares"))
        except ValueError:
            return apology("problem with shares", 400)

        if not shares or shares <= 0:
            return apology("missing, negative or null shares", 400)
        # MINE: EXTRACTED VALUES TO RE-USE
        current_cash = float(db.execute(
            "SELECT cash FROM users WHERE id = ?", session["user_id"])[0]["cash"])
        final_price = float((price_per_share * shares))
        # MINE: CHECKS IF USER HAS ENOUGH CASH
        if current_cash < final_price:
            return apology("insufficient cash", 400)

        # MINE: BEGINS TRANSACTION
        db.execute("BEGIN TRANSACTION")
        try:
            # MINE: TO CHECK IF USER HAS ALREADY THE STOCK
            owned_stock = db.execute(
                "SELECT shares FROM owned_stocks WHERE user_id = ? AND symbol = ?", session["user_id"], symbol)

            if owned_stock:
                # MINE: UPDATES THE DATA OF OWNED_STOCKS
                db.execute("UPDATE owned_stocks SET shares = ? WHERE user_id = ? AND symbol = ?",
                           (owned_stock[0]["shares"] + shares), session["user_id"], symbol)
            else:
                # MINE: INSERTS THE DATA INTO FINANCE.DB->OWNED_STOCKS
                db.execute("INSERT INTO owned_stocks (user_id, symbol, shares) VALUES (?, ?, ?)",
                           session["user_id"], symbol, shares)

            # MINE: UPDATES USER'S CASH
            db.execute("UPDATE users SET cash = ? WHERE id = ?",
                       (current_cash - final_price), session["user_id"])
            db.execute("INSERT INTO transactions (user_id, symbol, shares, price_per_share) VALUES (?, ?, ?, ?)",
                       session["user_id"], symbol, shares, price_per_share)
            db.execute("COMMIT")
        except:
            db.execute("ROLLBACK")
            return apology("database error", 403)

        return redirect("/")

    else:
        return render_template("buy.html")


@app.route("/history")
@login_required
def history():
    """Show history of transactions"""
    transactions = db.execute(
        "SELECT symbol, shares, price_per_share, date, hour FROM transactions WHERE user_id = ? ORDER BY hour DESC", session["user_id"])
    return render_template("history.html", transactions=transactions)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Ensure username was submitted
        if not request.form.get("username"):
            return apology("must provide username", 403)

        # Ensure password was submitted
        elif not request.form.get("password"):
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute(
            "SELECT * FROM users WHERE username = ?", request.form.get(
                "username")
        )

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(
            rows[0]["hash"], request.form.get("password")
        ):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out"""

    # Forget any user_id
    session.clear()

    # Redirect user to login form
    return redirect("/login")


@app.route("/quote", methods=["GET", "POST"])
@login_required
def quote():
    """Get stock quote."""
    if request.method == "POST":
        # MINE: CHECKS ALL POSSIBILITIES WITH QUOTING INPUTS
        # (IF IT'S EMPTY, IF THE SYMBOL IS VALID/EXISTS)
        symbol = request.form.get("symbol").upper()

        if not symbol:
            return apology("missing symbol", 400)
        elif not lookup(symbol):
            return apology("symbol not found", 400)

        price_per_share = lookup(symbol)["price"]

        return render_template("quote.html", method="POST", symbol=symbol, price_per_share=price_per_share)

    else:
        return render_template("quote.html", method="GET")


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    # MINE: CHECKS ALL POSSIBILITIES AND ERRORS DURING REGISTRATION
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        confirm_password = request.form.get("confirmation")
        # MINE: CHECKS PASSWORD, USERNAME, CONFIRMED PASSWORD
        if not username:
            return apology("must provide username", 400)
        elif not password or len(password) < 6:
            return apology("must provide password (at least 6 caracters)", 400)
        elif not confirm_password:
            return apology("must confirm password", 400)
        # MINE: CHECKS IF PASSWORDS ARE THE SAME
        elif confirm_password != password:
            return apology("passwords must be the same", 400)

        # MINE: CHECK IF USERNAME IS ALREADY TAKEN
        usernames = [row['username']
                     for row in db.execute("SELECT username FROM users")]
        if username in usernames:
            return apology("username is already taken", 400)

        # MINE: AFTER CHECKING EVERYTHING, MOVES ONTO REGISTER THE USER
        db.execute("INSERT INTO users (username, hash) VALUES (?, ?)",
                   username,
                   generate_password_hash(password))

        # MINE: COPY PASTED FROM LOGIN() TO REMEMBER THE SESSION OF THE USER
        session["user_id"] = db.execute(
            "SELECT * FROM users WHERE username = ?", username)[0]["id"]

        # MINE: REDIRECT THE USER TO HOMEPAGE AFTER REGISTERING
        return redirect("/login")

    else:
        return render_template("register.html")


@app.route("/sell", methods=["GET", "POST"])
@login_required
def sell():
    """Sell shares of stock"""
    if request.method == "POST":

        # MINE: CHECKS ALL POSSIBILITIES WITH SELLING INPUTS
        try:
            symbol = request.form.get("symbol").upper()
        except:
            return apology("missing or invalid symbol", 400)
        owned_shares = db.execute(
            "SELECT shares FROM owned_stocks WHERE user_id = ? AND symbol = ?", session["user_id"], symbol)[0]["shares"]
        if not owned_shares:
            return apology("you don't own this stock", 400)
        # MINE: CHECKS IF SHARES INPUT IS AN INTEGER
        try:
            shares = int(request.form.get("shares"))
        except ValueError:
            return apology("Shares must be an integer", 400)

        # MINE: CHECKS(IF IT'S EMPTY, IF SHARES ARE 0, IF SHARES IS INTEGER, IF DOESN'T OWN THE SHARES)
        if not symbol:
            return apology("missing symbol", 400)
        elif not shares or shares <= 0:
            return apology("missing, null or negative shares", 400)
        elif not lookup(symbol):
            return apology("symbol not found", 400)
        elif symbol not in [row['symbol'] for row in db.execute("SELECT symbol FROM owned_stocks WHERE user_id = ?", session["user_id"])]:
            return apology("you don't own this stock", 400)

        # MINE: CHECKS IF THE USER IS SELLING MORE SHARES THAN HE OWNS
        if owned_shares < shares:
            return apology("too many shares")

        # MINE: EXTRACTED VALUES TO RE-USE
        current_cash = db.execute(
            "SELECT cash FROM users WHERE id = ?", session["user_id"])[0]["cash"]
        final_gain = float((lookup(symbol)["price"] * shares))

        # MINE: BEGINS TRANSACTION
        db.execute("BEGIN TRANSACTION")
        try:
            # MINE: CHECK IF SHARES OF SAID SYMBOL WILL BECOME 0 AFTER SELLING
            if owned_shares == shares:
                db.execute(
                    "DELETE FROM owned_stocks WHERE user_id = ? and symbol = ?", session["user_id"], symbol)
            else:
                db.execute("UPDATE owned_stocks SET shares = ? WHERE user_id = ? and symbol = ?",
                           (int(db.execute("SELECT shares FROM owned_stocks WHERE user_id = ? and symbol = ?",
                            session["user_id"], symbol)[0]['shares']) - shares),
                           session["user_id"], symbol)
            # MINE: UPDATES USER'S CASH
            db.execute("UPDATE users SET cash = ? WHERE id = ?",
                       (current_cash + final_gain), session["user_id"])
            db.execute("INSERT INTO transactions (user_id, symbol, shares, price_per_share) VALUES (?, ?, ?, ?)",
                       session["user_id"], symbol, (-shares), lookup(symbol)["price"])
            db.execute("COMMIT")
        except:
            db.execute("ROLLBACK")
            return apology("database error", 403)

        return redirect("/")

    else:
        owned = db.execute(
            "SELECT symbol FROM owned_stocks WHERE user_id = ? GROUP BY symbol", session["user_id"])
        return render_template("sell.html", owned=owned)


# MINE: MANAGES YOUR WALLET AND LETS USER ADD MONEY UP TO 1 MILLION
@app.route("/wallet", methods=["GET", "POST"])
@login_required
def wallet():
    """Manages your wallet"""
    try:
        current_cash = float(db.execute(
            "SELECT cash FROM users WHERE id = ?", session["user_id"])[0]['cash'])
    except:
        return apology("missing money", 400)

    if request.method == "POST":
        try:
            amount = float(request.form.get("amount"))
        except:
            return apology("amount must be a number", 400)

        if not amount:
            return apology("amount missing", 400)
        elif amount <= 0:
            return apology("amount is null or negative", 400)
        elif (current_cash + amount) > 1000000.00:
            return apology("maximum amount of money in wallet is one million usd", 400)

        db.execute("UPDATE users SET cash = ? WHERE id = ?",
                   (current_cash + amount), session["user_id"])

        return redirect("/")

    else:
        return render_template("wallet.html", current_cash=current_cash)