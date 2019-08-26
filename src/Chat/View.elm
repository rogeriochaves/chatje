module Chat.View exposing (renderMessage, renderMessagesList, view)

import Chat.Types exposing (..)
import DateFormat
import Dict
import Element exposing (..)
import Element.Input as Input
import Html.Attributes
import Json.Decode as Decode
import RemoteData exposing (..)
import Styles exposing (..)
import Time exposing (utc)
import User.Data exposing (currentUser)
import User.Types as User
import Utils exposing (onEnter)


formatTimestamp : Int -> String
formatTimestamp =
    Time.millisToPosix
        >> DateFormat.format
            [ DateFormat.monthNameFull
            , DateFormat.text " "
            , DateFormat.dayOfMonthSuffix
            , DateFormat.text " "
            , DateFormat.hourMilitaryFixed
            , DateFormat.text ":"
            , DateFormat.minuteFixed
            ]
            utc


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
                 , htmlAttribute (Html.Attributes.id "draft-field")
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
    el [ padding 10, width fill, height fill ]
        (case messages of
            Just (Success messages_) ->
                column [ spacing 12, alignBottom ]
                    (List.map (renderMessage user) messages_)

            Just (Failure _) ->
                el [ centerX, centerY ] (text "Error on loading messages")

            _ ->
                el [ centerX, centerY ] (text "Loading...")
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

        textMessage =
            case ( message.stickerId, message.attachment ) of
                ( Just stickerId, _ ) ->
                    if stickerId == "369239263222822" then
                        [ text <| "👍" ++ message.message ]

                    else
                        [ text <| "<sticker " ++ stickerId ++ "> " ++ message.message ]

                ( Nothing, Just attachment ) ->
                    [ image
                        [ height (shrink |> maximum 300)
                        , width (shrink |> maximum 500)
                        ]
                        { src = attachment
                        , description = message.message
                        }
                    , text message.message
                    ]

                ( Nothing, Nothing ) ->
                    if message.message == "" then
                        [ text "<not implemented yet>" ]

                    else
                        [ text message.message ]
    in
    row
        [ spacing 12
        , htmlAttribute (Html.Attributes.id "message-item")
        ]
        [ el ([ width (px 200), alignTop ] ++ authorStyle) (text authorName)
        , paragraph
            [ width (px 200)
            , htmlAttribute (Html.Attributes.style "width" "calc(100vw - 700px)")
            ]
            textMessage
        , el
            ([ alignRight
             , alignTop
             , width (px 150)
             , htmlAttribute (Html.Attributes.id "message-timestamp")
             ]
                ++ Styles.timestamp
            )
            (text <| formatTimestamp message.timestamp)
        ]
