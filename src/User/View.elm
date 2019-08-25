module User.View exposing (login)

import Element exposing (..)
import Element.Input as Input
import Html.Attributes
import RemoteData exposing (..)
import Styles exposing (..)
import User.Types exposing (..)
import Utils exposing (onEnter)


login : Model -> Element Msg
login model =
    column
        [ centerX
        , centerY
        , spacing 12
        ]
        [ Input.email
            ([ onEnter Login ] ++ Styles.fieldInput)
            { onChange = UpdateEmail
            , text = model.email
            , placeholder = Nothing
            , label = Input.labelAbove [] (text "Email: ")
            }
        , Input.button ([ padding 10, alignRight ] ++ Styles.button)
            { onPress = Just Login
            , label = text "Login"
            }
        ]
