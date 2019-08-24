module Router.Routes exposing (Page(..), routes, toPath)

import Browser.Navigation
import Url.Parser exposing ((</>), Parser, map, oneOf, parse, s, top)


type Page
    = Home
    | NotFound


routes : Parser (Page -> a) a
routes =
    oneOf
        [ map Home top
        , map NotFound (s "404")
        ]


toPath : Page -> String
toPath page =
    case page of
        Home ->
            "/"

        NotFound ->
            "/404"
