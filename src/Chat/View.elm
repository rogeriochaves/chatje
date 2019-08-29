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
import Time
import User.Data exposing (currentUser)
import User.Types as User
import Utils exposing (onEnter)


formatTimestamp : Time.Zone -> Int -> String
formatTimestamp zone =
    Time.millisToPosix
        >> DateFormat.format
            [ DateFormat.monthNameAbbreviated
            , DateFormat.text " "
            , DateFormat.dayOfMonthSuffix
            , DateFormat.text " "
            , DateFormat.hourMilitaryFixed
            , DateFormat.text ":"
            , DateFormat.minuteFixed
            ]
            zone


view : User.Model -> String -> Model -> Element Msg
view user threadId model =
    let
        openInBrowser =
            if model.openInBrowserPopUp then
                row ([ width fill, padding 20 ] ++ Styles.popUp)
                    [ Input.button [] { label = text "Click here to open in browser", onPress = Just OpenInBrowser }
                    , Input.button [ alignRight ] { label = text "x", onPress = Just CloseOpenInBrowserPopup }
                    ]

            else
                Element.none
    in
    column [ width fill, inFront openInBrowser ]
        [ column
            [ width fill
            , clipY
            , scrollbarY
            , clipX
            , htmlAttribute (Html.Attributes.style "height" "calc(100vh - 50px)")
            , htmlAttribute (Html.Attributes.id "chat")
            ]
            [ renderMessagesList model user (Dict.get threadId model.messages) ]
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


renderMessagesList : Model -> User.Model -> Maybe (WebData (List Message)) -> Element Msg
renderMessagesList model user messages =
    el [ padding 10, width fill, height fill ]
        (case messages of
            Just (Success messages_) ->
                column [ alignBottom ]
                    (List.map (renderMessage model user) messages_)

            Just (Failure _) ->
                el [ centerX, centerY ] (text "Error on loading messages")

            _ ->
                el [ centerX, centerY ] (text "Loading...")
        )


renderMessage : Model -> User.Model -> Message -> Element Msg
renderMessage model user message =
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

        linkedMessage =
            addLinks message.message

        textMessage =
            case ( message.stickerId, message.image ) of
                ( Just stickerId, _ ) ->
                    if stickerId == "369239263222822" then
                        [ text <| "👍" ++ message.message ]

                    else
                        [ text <| "<sticker " ++ stickerId ++ "> " ] ++ linkedMessage

                ( Nothing, Just image ) ->
                    let
                        ( imgWidth, imgHeight ) =
                            limitSize ( image.width, image.height )
                    in
                    [ Element.image
                        [ width (px imgWidth)
                        , height (px imgHeight)
                        ]
                        { src = image.url
                        , description = message.message
                        }
                    ]
                        ++ linkedMessage

                ( Nothing, Nothing ) ->
                    if message.message == "" then
                        [ text "<not implemented yet>" ]

                    else
                        linkedMessage

        timestamp =
            el
                ([ alignRight
                 , htmlAttribute (Html.Attributes.id "message-timestamp")
                 ]
                    ++ Styles.timestamp
                )
                (text <| formatTimestamp model.zone message.timestamp)
    in
    row
        [ spacing 12
        , paddingXY 0 6
        , htmlAttribute (Html.Attributes.id "message-item")
        ]
        [ el ([ width (px 200), alignTop ] ++ authorStyle) (text authorName)
        , paragraph
            [ width (px 200)
            , htmlAttribute (Html.Attributes.style "width" "calc(100vw - 550px)")
            ]
            (timestamp :: textMessage)
        ]


limitSize : ( Int, Int ) -> ( Int, Int )
limitSize ( width, height ) =
    if height > 300 then
        limitSize ( toFloat width * (300 / toFloat height) |> ceiling, 300 )

    else if width > 500 then
        limitSize ( 500, toFloat height * (500 / toFloat width) |> ceiling )

    else
        ( width, height )


type TextOrLink
    = PlainText String
    | Linked String


addLinks message =
    String.split "\n" message
        |> List.concatMap
            (\line ->
                String.split " " line
                    |> List.map
                        (\str ->
                            if String.startsWith "http" str then
                                Linked str

                            else
                                PlainText str
                        )
                    |> List.foldl
                        (\item acc ->
                            case ( List.head acc, item ) of
                                ( Nothing, _ ) ->
                                    [ item ]

                                ( Just (PlainText str), PlainText str_ ) ->
                                    PlainText (str ++ " " ++ str_) :: (List.tail acc |> Maybe.withDefault [])

                                ( Just (PlainText str), Linked str_ ) ->
                                    Linked str_ :: acc

                                _ ->
                                    item :: acc
                        )
                        []
                    |> List.reverse
                    |> List.map
                        (\item ->
                            case item of
                                PlainText str ->
                                    text (str ++ " ")

                                Linked str ->
                                    Element.newTabLink [] { label = text (str ++ " "), url = str }
                        )
            )
