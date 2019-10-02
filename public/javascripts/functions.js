function postReply(commentId) {
    commentId = commentId.substring(0, commentId.length - 6);
    var xhr = new XMLHttpRequest();
    var form = document.getElementById(commentId + "postReply").elements;
    //console.dir(form);
    var formData = {};
    formData.reply = form[0].value;
    xhr.open('POST', "/reply/" + commentId);
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.responseType = "json";
    xhr.send(JSON.stringify(formData));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            document.getElementById(commentId + "postReply").reset();
            document.getElementById(commentId + "postReply").elements[0].textContent = "add a reply..";
            if (xhr.status == 500) {
                alert(xhr.responseText);
            } else
            if (xhr.status == 401) {
                alert(xhr.response.msg);
                location.href = xhr.response.path;
            } else
            if (xhr.status != 200) {
                alert(xhr.response.msg);
            } else {
                alert(xhr.response.msg);
                document.getElementById(commentId + "replyCount").innerHTML = xhr.response.data.length + " replied";
                var list = document.getElementById(commentId + 'replyList');
                var date = new Date(xhr.response.reply.createDate).toLocaleString();
                var email = xhr.response.reply.user.email;
                var reply = xhr.response.reply.reply;
                var id = xhr.response.reply._id;
                var style = "border: 1px solid;align-items: center;padding-left: 14px;width: 453px;position: relative;left: 11%;background:rgb(175, 2266, 221)";
                var li = "<div style='" + style + "' id='" + id + "'> <a href='/" + email + "' style='padding-right: 5px;font-size: smaller;text-decoration: none;'>" + email + "</a> <a style='font-size: small;color: black;text-decoration: none;cursor: pointer;padding-left: 0px; color:rgb(85, 26, 139);'>delete reply</a> <font style='font-size: xx-small;padding-left: 3px;'>" + date + "</font> <br> <br>" + reply + " <br><br> </div> <br> <br>";
                list.insertAdjacentHTML("beforeend", li);
            }
        }
    };
}

function hitLike(postId, buttonId) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "/like/" + postId);
    xhr.responseType = "json";
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status == 500) {
                alert(xhr.responseText);
            } else
            if (xhr.status != 200) {
                alert(xhr.response.msg);
                location.href = xhr.response.path;
            } else {
                if (document.getElementById(buttonId).value == 'like') {
                    document.getElementById(buttonId).value = 'unlike';
                } else {
                    document.getElementById(buttonId).value = 'like';
                }
            }
        }
    };
}

function deleteReply(id) {
    id = id.substring(0, id.length - 6);
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', "/reply/" + id);
    xhr.responseType = "json";
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status == 500)
                alert(xhr.responseText);
            else
            if (xhr.status == 401) {
                alert(xhr.response.msg);
                location.href = xhr.response.path;
            } else
            if (xhr.status == 200) {
                alert(xhr.response.msg);
                var item = document.getElementById(id);
                item.parentNode.removeChild(item);
                document.getElementById(xhr.response.data._id + "replyCount").innerHTML = xhr.response.data.reply.length + " replied";
            } else
                alert(xhr.response.msg);
        }
    };
}

function replyList(commentId) {
    commentId = commentId.substring(0, commentId.length - 10);
    if (document.getElementById(commentId + 'replyList').style.display == 'none') {
        document.getElementById(commentId + 'replyList').style.display = 'block';
        var xhr = new XMLHttpRequest();
        xhr.open('GET', "/reply/" + commentId);
        xhr.responseType = "json";
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status == 500) {
                    alert(xhr.responseText);
                } else
                if (xhr.status != 200) {
                    alert(xhr.response.msg);
                } else {
                    for (var i = 0; i < xhr.response.reply.length; i++) {
                        var list = document.getElementById(commentId + 'replyList');
                        var date = new Date(xhr.response.reply[i].createDate).toLocaleString();
                        var email = xhr.response.reply[i].user.email;
                        var reply = xhr.response.reply[i].reply;
                        var id = xhr.response.reply[i]._id;
                        var style = "border: 1px solid;align-items: center;padding-left: 14px;width: 453px;position: relative;left: 11%;background:rgb(175, 2266, 221)";
                        var li = "<div style='" + style + "' id='" + id + "'> <a href='/" + email + "' style='padding-right: 5px;font-size: smaller;text-decoration: none;'>" + email + "</a> <span id='" + id + "delete' onclick='deleteReply(this.id)' style='font-size: small;color: black;text-decoration: none;cursor: pointer;padding-left: 0px; color:rgb(85, 26, 139);'>delete reply</span> <font style='font-size: xx-small;padding-left: 3px;'>" + date + "</font> <br> <br>" + reply + " <br><br> </div> <br> <br>";
                        list.insertAdjacentHTML("beforeend", li);
                    }
                }
            }
        };
    } else {
        document.getElementById(commentId + 'replyList').style.display = 'none';
        var list = document.getElementById(commentId + 'replyList');
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }
    }
}

function deleteComment(id) {
    id = id.substring(0, id.length - 13);
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', "/comment/" + id);
    xhr.responseType = "json";
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status == 500)
                alert(xhr.responseText);
            else
            if (xhr.status == 401) {
                alert(xhr.response.msg);
                location.href = xhr.response.path;
            } else
            if (xhr.status == 200) {
                alert(xhr.response.msg);
                var item = document.getElementById(id);
                item.parentNode.removeChild(item);
                document.getElementById(xhr.response.data._id + "commentCount").value = xhr.response.data.comments.length + " comments";
            } else
                alert(xhr.response.msg);
        }
    };
}

function commentList(postId) {
    if (document.getElementById(postId + 'commentList').style.display == 'none') {
        document.getElementById(postId + 'commentList').style.display = 'block';
        var xhr = new XMLHttpRequest();
        xhr.open('GET', "/comment/" + postId);
        xhr.responseType = "json";
        xhr.send();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status == 500) {
                    alert(xhr.responseText);
                } else
                if (xhr.status != 200) {
                    alert(xhr.response.msg);
                } else {
                    for (let i = 0; i < xhr.response.comments.length; i++) {
                        var list = document.getElementById(postId + 'commentList');
                        var date = new Date(xhr.response.comments[i].createDate).toLocaleString();
                        var email = xhr.response.comments[i].user.email;
                        var comment = xhr.response.comments[i].comment;
                        var id = xhr.response.comments[i]._id;
                        var replies = xhr.response.comments[i].reply.length;
                        var postReplies = "<form  id='" + id + "postReply' style='display: inline; padding-left: 32px;'><input type='text' style='position: relative;left: 65px;' name='reply' placeholder='add a reply..' size='60'><input type='button' id='" + id + "button" + "' onclick='postReply(this.id)' style='position: relative;left: 83px;' value='Post Reply'></form>";
                        var replyList = "<ul id='" + id + "replyList' style='disply:none'> </ul>";
                        var style = "border: 1px solid;align-items: center;padding-left: 7px;width: 584px;position: relative;left: -7%;background:rgb(234, 190, 200)";
                        var li = "<div style='" + style + "' id='" + id + "'> <a href='/" + email + "' style='padding-right: 20px;font-size: smaller;text-decoration: none;'>" + email + "</a> <span id='" + id + "commentDelete' style='font-size: small;color: black;text-decoration: none;cursor: pointer;padding-left: 0px; color:rgb(85, 26, 139);' onclick='deleteComment(this.id)'>delete comment</span> <span id='" + id + "replyCount' onclick='replyList(this.id)' style='font-size: small;padding-left: 12px;cursor: pointer;color:rgb(85, 26, 139);'> " + replies + " replied</span> <font style='font-size: xx-small;padding-left: 3px;'>" + date + "</font> <br> <br>" + comment + " <br><br> " + postReplies + "<br><br>" + replyList + " <br></div> <br> <br>";
                        list.insertAdjacentHTML("beforeend", li);
                    }
                }
            }
        };
    } else {
        document.getElementById(postId + 'commentList').style.display = 'none';
        var list = document.getElementById(postId + 'commentList');
        while (list.hasChildNodes()) {
            list.removeChild(list.firstChild);
        }
    }
}

function postComment(postId) {
    var xhr = new XMLHttpRequest();
    var form = document.getElementById(postId + "postComment").elements;
    var formData = {};
    for (let i = 0; i < form.length - 1; i++) {
        formData[form[i].name] = form[i].value;
    }
    xhr.open('POST', "/comment/" + postId);
    xhr.setRequestHeader('Cache-Control', 'no-cache');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.responseType = "json";
    xhr.send(JSON.stringify(formData));
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            document.getElementById(postId + "postComment").reset();
            document.getElementById(postId + "postComment").elements[0].textContent = "write a comment..";
            if (xhr.status == 500) {
                alert(xhr.responseText);
            } else
            if (xhr.status == 401) {
                alert(xhr.response.msg);
                location.href = xhr.response.path;
            } else
            if (xhr.status != 200) {
                alert(xhr.response.msg);
            } else {
                alert("you commented");
                document.getElementById(postId + "commentCount").value = xhr.response.data.length + " comments";
                var list = document.getElementById(postId + 'commentList');
                var date = new Date(xhr.response.comment.createDate).toLocaleString();
                var email = xhr.response.comment.user.email;
                var comment = xhr.response.comment.comment;
                var id = xhr.response.comment._id;
                var replies = xhr.response.comment.reply.length;
                var postReplies = "<form  id='" + id + "postReply' style='display: inline;padding-left: 32px;'><input type='text' style='position: relative;left: 65px;' name='reply' placeholder='add a reply..' size='60'><input type='button' id='" + id + "button" + "' onclick='postReply(this.id)' style='position: relative;left: 83px;' value='Post Reply'></form>";
                var replyList = "<ul id='" + id + "replyList' style='disply:none'></ul>";
                var style = "box-shadow: 4px 4px 13px black;align-items: center;padding-left: 7px;width: 584px;position: relative;left: -7%;background:rgb(234, 190, 200)";
                var li = "<div style='" + style + "' id='" + id + "'> <a href='/" + email + "' style='padding-right: 20px;font-size: smaller;text-decoration: none;'>" + email + "</a> <a style='font-size: small;color: black;text-decoration: none;cursor: pointer;padding-left: 0px; color:rgb(85, 26, 139);'>delete comment</a> <span id='" + id + "replyCount' onclick='replyList(this.id)' style='font-size: small;padding-left: 12px;cursor: pointer;color:rgb(85, 26, 139);'> " + replies + " replied</span> <font style='font-size: xx-small;padding-left: 3px;'>" + date + "</font> <br> <br>" + comment + " <br><br> " + postReplies + "<br><br>" + replyList + " <br></div> <br> <br>";
                list.insertAdjacentHTML("beforeend", li);
            }
        }
    };
}