package routes

import (
	"net/http"
	"visual_recognition/server/controllers"

	"github.com/gorilla/mux"
)

type Route struct {
	Method     string
	Pattern    string
	Handler    http.HandlerFunc
	Middleware mux.MiddlewareFunc
}

var routes []Route

func init() {
	register("GET", "/movies", controllers.AllMovies, nil)
	register("GET", "/movies/{id}", controllers.FindMovie, nil)
	register("POST", "/movies", controllers.CreateMovie, nil)
	register("PUT", "/movies", controllers.UpdateMovie, nil)
	register("DELETE", "/movies", controllers.DeleteMovie, nil)
}

func NewRouter() *mux.Router {
	r := mux.NewRouter()
	for _, route := range routes {
		r.HandleFunc(route.Pattern, route.Handler).Methods(route.Method)

		if route.Middleware != nil {
			r.Use(route.Middleware)
		}
	}
	return r
}

func register(method, pattern string, handler http.HandlerFunc, middleware mux.MiddlewareFunc) {
	routes = append(routes, Route{method, pattern, handler, middleware})
}
