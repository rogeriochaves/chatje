module Chat.View exposing (renderMessage, renderMessagesList, view)

import Chat.Types exposing (..)
import Dict
import Element exposing (..)
import Element.Input as Input
import Html.Attributes
import Json.Decode as Decode
import RemoteData exposing (..)
import Styles exposing (..)
import User.Data exposing (currentUser)
import User.Types as User
import Utils exposing (onEnter)


view : User.Model -> String -> Model -> Element Msg
view user threadId model =
    column [ width fill ]
        [ column
            [ width fill
            , clipY
            , scrollbarY
            , clipX
            , htmlAttribute (Html.Attributes.style "height" "calc(100vh - 50px)")
            , htmlAttribute (Html.Attributes.id "chat")
            ]
            [ renderMessagesList user (Dict.get threadId model.messages) ]
        , el ([ width fill ] ++ Styles.messageBox)
            (Input.text
                ([ height (px 40)
                 , onEnter (SendMessage threadId)
                 ]
                    ++ Styles.messageBoxInput
                )
                { onChange = UpdateDraft
                , text = model.draft
                , placeholder = Nothing
                , label = Input.labelHidden "message to send"
                }
            )
        ]


renderMessagesList : User.Model -> Maybe (WebData (List Message)) -> Element Msg
renderMessagesList user messages =
    el [ padding 10 ]
        (case messages of
            Just (Success messages_) ->
                column [ spacing 12 ]
                    (List.map (renderMessage user) messages_)

            Just (Failure _) ->
                text "Error on loading messages"

            _ ->
                text "Loading..."
        )


renderMessage : User.Model -> Message -> Element Msg
renderMessage user message =
    let
        authorName =
            Dict.get message.authorId user.users
                |> Maybe.map (\u -> u.name ++ ":")
                |> Maybe.withDefault ""

        authorStyle =
            if Just message.authorId == (currentUser user |> Maybe.map .id) then
                Styles.selfName

            else
                Styles.authorName
    in
    row [ spacing 12 ]
        [ el ([ width (px 200), alignTop ] ++ authorStyle) (text authorName)
        , paragraph
            [ width (px 200)
            , htmlAttribute (Html.Attributes.style "width" "calc(100vw - 550px)")
            ]
            [ text message.message ]
        ]
