module Router.Routes exposing (Page(..), parseUrl, routes, toPath)

import Browser.Navigation
import Url exposing (Url)
import Url.Parser exposing ((</>), Parser, map, oneOf, parse, s, string, top)


type Page
    = Home
    | NotFound
    | ChatPage String
    | Login
    | PasteLink


routes : Parser (Page -> a) a
routes =
    oneOf
        [ map Home top
        , map NotFound (s "404")
        , map ChatPage (s "chat" </> string)
        , map Login (s "login")
        , map PasteLink (s "paste-link")
        ]


toPath : Page -> String
toPath page =
    case page of
        Home ->
            "/"

        NotFound ->
            "/404"

        ChatPage threadId ->
            "/chat/" ++ threadId

        Login ->
            "/login"

        PasteLink ->
            "/paste-link"


parseUrl : Url -> Page
parseUrl url =
    Maybe.withDefault NotFound <| parse routes url
