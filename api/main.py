import json
from flask import Flask, request, jsonify, send_file,json
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, or_, and_, Boolean, func
from email_validator import EmailNotValidError, validate_email
from flask_cors import CORS, cross_origin
import random
import time
from datetime import datetime
from celery import Celery
from celery.schedules import crontab
from werkzeug.utils import secure_filename
import uuid
import os
from collections import OrderedDict
import re

json.provider.DefaultJSONProvider.ensure_ascii = False

app=Flask(__name__)
cors=CORS(app)

app.config["JWT_SECRET_KEY"]='test'
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['JSON_AS_ASCII'] = False
app.config["JWT_ACCESS_TOKEN_EXPIRES"]=timedelta(days=30)
app.config['SQLALCHEMY_DATABASE_URI']='sqlite:///test.db'
app.config['CELERY_BROKER_URL']='redis://localhost:6379/0'
app.config['CELERY_RESULT_BACKEND']='redis://localhost:6379/0'
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}

jwt=JWTManager(app)
db=SQLAlchemy(app)
celery=Celery(app.name,broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

class User(db.Model):
    id=Column(Integer, primary_key=True, autoincrement=True)
    username=Column(String,unique=True)
    password=Column(String(10))
class Comments(db.Model):
    id=Column(Integer, primary_key=True, autoincrement=True)
    username=Column(String,nullable=False)
    user_id=Column(Integer,ForeignKey('user.id'),nullable=False)
    title_id=Column(Integer,ForeignKey('title.id'),nullable=False)
    comment=Column(String,nullable=False)
    pub_date=Column(DateTime,default=datetime.now)
class Bookmarks(db.Model):
    id=Column(Integer, primary_key=True, autoincrement=True)
    user_id=Column(Integer,ForeignKey('user.id'),nullable=False)
    title_id=Column(Integer,ForeignKey('title.id'),nullable=False)
    date=Column(DateTime,default=datetime.now)
class Likes(db.Model):
    id=Column(Integer, primary_key=True, autoincrement=True)
    user_id=Column(Integer,ForeignKey('user.id'),nullable=False)
    title_id=Column(Integer,ForeignKey('title.id'),nullable=False)
    chapter_id=Column(Integer,ForeignKey('chapter.id'),nullable=False)
    value=Column(Boolean,default=True)
class Rating(db.Model):
    id=Column(Integer, primary_key=True, autoincrement=True)
    user_id=Column(Integer,ForeignKey('user.id'),nullable=False)
    title_id=Column(Integer,ForeignKey('title.id'),nullable=False)
    value=Column(Integer,nullable=False)

title_genre=db.Table('title_genre',
                    Column("title_id",Integer,ForeignKey("title.id"),primary_key=True),
                    Column('genre_id',Integer,ForeignKey('genre.id'),primary_key=True)
                    )

class Title(db.Model):
    id=Column(Integer, primary_key=True, autoincrement=True)
    name_Eng=Column(String)
    name_Rus=Column(String)
    year=Column(Integer)
    description=Column(String)
    title_type=Column(String,ForeignKey('type.name'),nullable=False)
    status=Column(String,ForeignKey('status.name'),nullable=False)
    dir=Column(String)
    rating=Column(Float,default=0)
    likes=Column(Integer,default=0)
    bookmarks=Column(Integer,default=0)
    view_count_total=Column(Integer,default=0)
    view_count_day=Column(Integer,default=0)
    view_count_month=Column(Integer,default=0)
    cover=Column(String)
    pub_date=Column(DateTime, nullable=False, default=datetime.now)
    upd_date=Column(DateTime)
    genres=db.relationship("Genre",secondary=title_genre,backref='title',lazy=True)
    title_chapters=db.relationship("Chapter",backref="title",lazy=True)
    def update_views(self):
        self.view_count_total +=1
        self.view_count_day +=1
        self.view_count_month +=1
    def update_rating(self):
        self.rating
    def add_likes(self):
        self.likes +=1
    def add_bookmarks(self):
        self.bookmarks +=1
    def delete_bookmarks(self):
        self.bookmarks -=1
    def remove_bookmarks(self):
        self.bookmarks -=1
    def reset_view_day(self):
        self.view_count_day=0
    def reset_view_month(self):
        self.view_count_month=0

class Genre(db.Model):
    id=Column(Integer, primary_key=True, autoincrement=True)
    name=Column(String,unique=True)
class Status(db.Model):
    id=Column(Integer, primary_key=True, autoincrement=True)
    name=Column(String,unique=True)
class Type(db.Model):
    id=Column(Integer, primary_key=True, autoincrement=True)
    name=Column(String,unique=True)

class Image(db.Model):
    id=Column(Integer,primary_key=True,autoincrement=True)
    chapter_id=Column(Integer,ForeignKey("chapter.id"),nullable=False)
    width=Column(Integer,nullable=False)
    height=Column(Integer,nullable=False)
    filename=Column(String(100),nullable=False)
class Chapter(db.Model):
    id=Column(Integer, primary_key=True, autoincrement=True)
    title_id=Column(Integer,ForeignKey("title.id"),nullable=False)
    name=Column(String)
    likes=Column(Integer,default=0)
    chapter_number=Column(Float,nullable=False)
    chapter_tom=Column(Integer,nullable=False)
    pub_date=Column(DateTime, default=datetime.now)
    images=db.relationship("Image",backref="chapters",lazy=True)
    def add_like(self):
        self.likes +=1


with app.app_context():
    db.create_all()

@celery.task
def reset_daily_views():
    titles=Title.query.all()
    for title in titles:
        title.reset_view_day()
@celery.task
def reset_monthly_views():
    titles=Title.query.all()
    for title in titles:
        title.reset_view_month()

@celery.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=0,minute=0),
        reset_daily_views.s()
    )
    sender.add_periodic_task(
        crontab(hour=0,minute=0,day_of_month='1'),
        reset_monthly_views.s()
    )

@app.route('/media/<file>')
@cross_origin()
def send_img(file):
    return send_file(f'uploads/{file}',mimetype='image/jpeg')

type_data={
    1:"Манга",
    2:"Манхва",
    3:"Маньхуа",
    4:"Западный комикс"
}
status_data={
    1:"Продолжается",
    2:"Закончен",
    3:"Заморожен",
    4:"Заброшен"
}
@app.route('/api/catalog')
@cross_origin()
def catalog():
    order = request.args.get('order', type=int)
    types = request.args.getlist('type',type=int)
    genres = request.args.getlist('genre', type=int)
    status = request.args.getlist('status', type=int)
    year_to = request.args.get('year_to', type=int)
    year_from = request.args.get('year_from', type=int)
    rating_to = request.args.get('rating_to', type=int)
    rating_from = request.args.get('rating_from', type=int)

    query=Title.query
    if types:
        type_filters = [Title.title_type == type_data[type_] for type_ in types]
        query = query.filter(or_(*type_filters))
    if genres:
        genre_filters = [Genre.id == int(genre_id) for genre_id in genres]
        for genre_filter in genre_filters:
            query = query.filter(Title.genres.any(genre_filter))
    if status:
        status_filters = [Title.status == status_data[status_] for status_ in status]
        query = query.filter(or_(*status_filters))
    if year_to is not None:
        query = query.filter(Title.year <= year_to)
    if year_from is not None:
        query = query.filter(Title.year >= year_from)
    if rating_to is not None:
        query = query.filter(Title.rating <= rating_to)
    if rating_from is not None:
        query = query.filter(Title.rating >= rating_from)

    if order == 0:
        query = query.order_by(Title.view_count_total.desc())
    elif order == 1:
        query = query.order_by(Title.pub_date.desc())
    elif order == 2:
        query = query.order_by(Title.upd_date.desc())
    else:
        query = query.order_by(Title.view_count_total.desc())

    titles=query.all()
    
    result = [{'id': title.id, 
               'name_Rus': title.name_Rus, 
               'year': title.year, 
               'type': title.title_type, 
               'cover':title.cover, 
               'status': title.status,
               'rating': title.rating, 
               'dir':title.dir,
               'genres': [genre.name for genre in title.genres]}
                 for title in titles
            ]

    return jsonify(result)
@app.route("/api/bookmarks")
@cross_origin()
def get_bookmarks():
    user_id=request.args.get("user-id")
    bookmarks=Bookmarks.query.filter_by(user_id=user_id).all()
    titles=Title.query.filter(Title.id.in_([item.title_id for item in bookmarks]))
    result = [{'id': title.id, 
               'name_Rus': title.name_Rus, 
               'year': title.year, 
               'type': title.title_type, 
               'cover':title.cover, 
               'rating': title.rating, 
               'dir':title.dir
               }
                 for title in titles
            ]

    return jsonify(result)
@app.route('/api/title/<dir>', methods=['GET'])
@cross_origin()
def get_title(dir):
    title=Title.query.filter_by(dir=dir).first()
    user_id=request.args.get("user_id")
    if(user_id != "null"):
        user_rating=Rating.query.filter_by(user_id=user_id,title_id=title.id).first()
        if not user_rating:
            user_rating=0
        else:
            user_rating=user_rating.value
        is_bookmark=Bookmarks.query.filter_by(title_id=title.id,user_id=user_id).first()
    else:
        user_rating=0
    if is_bookmark:
        is_bookmark=True
    else:
        is_bookmark=False
    if title:
        response={
            "id":title.id,
            "name_rus":title.name_Rus,
            "year":title.year,
            "description":title.description,
            "type":title.title_type,
            "status":title.status,
            "rating":title.rating,
            "likes":title.likes,
            "bookmarks":title.bookmarks,
            "view_count":title.view_count_total,
            "cover":title.cover,
            "user_rating":user_rating,
            "is_bookmark":is_bookmark,
            "genres":[{"id":gener.id,"name":gener.name}for gener in title.genres],
            "chapter_count":len(title.title_chapters),
            "chapters":[{"id":chapter.id,"title_id":chapter.title_id,"name":chapter.name,"chapter_number":chapter.chapter_number,"chapter_tom":chapter.chapter_tom,"pub_date":chapter.pub_date,"likes":chapter.likes} for chapter in title.title_chapters]
        }
        return jsonify(response), 200
    else:
        return jsonify({"msg": "404"}), 404
@app.route('/api/add-to-favorite',methods=["POST"])
@cross_origin()
def add_to_favorite():
    try:
        data=json.loads(request.data)
        chapter=Chapter.query.filter_by(id=data["chapter_id"]).first()
        chapter.add_like()
        title=Title.query.filter_by(id=chapter.title_id).first().add_likes()
        like=Likes(user_id=data["user_id"],chapter_id=data["chapter_id"],title_id=chapter.title_id)
        db.session.add(like)
        db.session.commit()
        return jsonify({"msg":"success"}),200
    except :
        print(e)
        return jsonify(e), 500
@app.route("/api/add-to-bookmarks",methods=["POST"])
@cross_origin()
def add_to_bookmarks():
    try:
        data=json.loads(request.data)
        title=Title.query.filter_by(id=data["title_id"]).first()
        check_bookmarks=Bookmarks.query.filter_by(title_id=data["title_id"],user_id=data["user_id"]).first()
        if not check_bookmarks:
            bookmark=Bookmarks(title_id=data["title_id"],user_id=data["user_id"])
            title.add_bookmarks()
            db.session.add(bookmark)
        else:
            title.delete_bookmarks()
            db.session.delete(check_bookmarks)
        db.session.commit()
        return jsonify({"msg":"success"}),200
    except Exception as e:
        print(e)
        return jsonify(), 500
@app.route('/api/chapter/<chapter_id>')
@cross_origin()
def get_chapter(chapter_id):
    user_id=request.args.get("user_id")
    curent_chapter=Chapter.query.filter_by(id=chapter_id).first()
    other_chapter=Chapter.query.filter_by(title_id=curent_chapter.title_id).all()
    title=Title.query.filter_by(id=curent_chapter.title_id).first()
    title.update_views()
    db.session.commit()
    if Likes.query.filter_by(user_id=user_id,chapter_id=chapter_id).first():
        liked=True
    else:
        liked=False
    response={
        "current":{
            "id":curent_chapter.id,
            "title_id":curent_chapter.title_id,
            "images":[{"id":image.id,"width":image.width,"height":image.height,"filename":image.filename}for image in curent_chapter.images],
            "liked":liked
        },
        "other_chapters":[{"id":chpt.id,"tom":chpt.chapter_tom,"chapter_number":chpt.chapter_number}for chpt in other_chapter]
    }
    return jsonify(response)
@app.route('/api/search')
@cross_origin()
def search():
    search_param=request.args.get("query")
    titles = Title.query.filter(Title.name_Rus.ilike(f'%{search_param}%')).all()
    titles_json=[{"name_Rus":title.name_Rus,"type":title.title_type,"rating":title.rating,"cover":title.cover,"dir":title.dir} for title in titles]
    print(search_param)
    return jsonify(titles_json)


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/api/new-title',methods=['POST'])
@cross_origin()
def newTitle():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        secure_name = secure_filename(file.filename)
        unique_filename = str(uuid.uuid4()) + os.path.splitext(secure_name)[1]
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(file_path)

        data=json.loads(request.form['data'])[0]
        print(data)
        rus_name=data['rus_name']
        eng_name=data['eng_name']
        description=data['description']
        title_type_raw=data['type']['label']
        title_status_raw=data['status']['label']
        genres_raw=data['genres']
        year=data['year']
        dir=re.sub(r'[^A-Za-z0-9\-]','',eng_name.replace(" ","-")).lower()
        cover=unique_filename
        title_type=Type.query.filter_by(name=title_type_raw).first().name
        title_status=Status.query.filter_by(name=title_status_raw).first().name
        genres=[]
        for gener_ in genres_raw:
            genres.append(Genre.query.filter_by(name=gener_["label"]).first())
        title=Title(name_Rus=rus_name,name_Eng=eng_name,year=year,description=description,title_type=title_type,status=title_status,dir=dir,cover=cover,genres=genres)
        db.session.add(title)
        db.session.commit()
        return jsonify({'msg':"success"}), 200
@app.route('/api/login',methods=['POST'])
@cross_origin()
def login():
    data=json.loads(request.form['data'])[0]
    username=data['username']
    password=data["password"]
    user=User.query.filter_by(username=username,password=password).first()
    if user:
        token=create_access_token(identity={"username":username,"user_id":user.id})
        return jsonify(access_token=token)
    else:
        return jsonify(), 404
@app.route('/api/register',methods=['POST'])
@cross_origin()
def register():
    data=json.loads(request.form['data'])[0]
    username=data['username']
    password=data["password"]
    is_exist=User.query.filter_by(username=username).first()
    if is_exist:
        return jsonify({"msg":"Invalid username"})
    else:
        try:
            user=User(username=username,password=password)
            db.session.add(user)
            db.session.commit()
            return jsonify(),200
        except:
            return jsonify({"msg":"Invalid username"})
        
@app.route('/api/create-comment',methods=["POST"])
@cross_origin()
@jwt_required()
def create_comment():
    try:
        data=json.loads(request.data)
        comment=Comments(username=data["username"],
                         user_id=data["user_id"],
                         title_id=data["title_id"],
                         comment=data["comment"])
        db.session.add(comment)
        db.session.commit()
        return jsonify({"msg":"success"}),200
    except:
        return jsonify(), 500
@app.route('/api/set-rating',methods=["POST"])
@cross_origin()
@jwt_required()
def set_rating():
    try:
        data=json.loads(request.data)
        check_rating=Rating.query.filter_by(user_id=data["user_id"],title_id=data["title_id"]).first()
        if (check_rating):
            check_rating.value=data["value"]
        else:
            rating=Rating(user_id=data["user_id"],title_id=data["title_id"],value=data["value"])
            db.session.add(rating)
            db.session.commit()

        rating_avg=db.session.query(func.avg(Rating.value)).filter_by(title_id=data["title_id"]).scalar()
        title=Title.query.filter_by(id=data["title_id"]).first()
        title.rating=round(rating_avg,1)
        db.session.commit()
        return jsonify(),200
    except Exception as e:
        print(e)
        return jsonify(),500

@app.route("/api/title/<dir>/comments")
@cross_origin()
def get_comments(dir):
    title = Title.query.filter_by(dir=dir).first()
    if not title:
        return jsonify({"msg": "404"}), 404

    title_id = title.id
    comments = Comments.query.filter_by(title_id=title_id).order_by(Comments.pub_date.desc()).all()
    
    if comments:
        data = [{"username": comment.username, "comment": comment.comment} for comment in comments]
        ordered_data = OrderedDict([("data", data)])
        return jsonify(ordered_data), 200
    
    return jsonify({"msg": "No comments found"}), 404

if __name__=='__main__':
    app.run(debug=True)