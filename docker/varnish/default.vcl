vcl 4.1;

backend default {
    .host = "app";
    .port = "3000";
}

sub vcl_recv {
    if (req.url ~ "\.(js|css|woff2?|ttf|eot|svg|ico|png|jpg|jpeg|gif|webp|avif)(\?.*)?$") {
        unset req.http.Cookie;
        return (hash);
    }
    return (pass);
}

sub vcl_hash {
    hash_data(req.url);
    hash_data(req.http.host);
    return (lookup);
}

sub vcl_backend_response {
    if (bereq.url ~ "\.(js|css|woff2?|ttf|eot|svg|ico|png|jpg|jpeg|gif|webp|avif)(\?.*)?$") {
        set beresp.ttl = 7d;
        unset beresp.http.Set-Cookie;
    }
}

sub vcl_deliver {
    if (obj.hits > 0) {
        set resp.http.X-Cache = "HIT";
    } else {
        set resp.http.X-Cache = "MISS";
    }
    set resp.http.X-Cache-TTL = obj.ttl;
}
