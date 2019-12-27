module Threads.View exposing (renderThread, view)

import Element exposing (..)
import Element.Input as Input
import Html.Attributes
import RemoteData exposing (..)
import Router.Routes exposing (..)
import Styles
import Threads.Data exposing (isUnread)
import Threads.Types exposing (..)
import User.Types exposing (User)
import Utils exposing (onEnter)


view : Page -> WebData User -> Model -> Element Msg
view currentPage user model =
    column []
        [ el ([ width fill ] ++ Styles.searchBox)
            (Input.text
                ([ height (px 40)
                 , onEnter SearchThread
                 ]
                    ++ Styles.messageBoxInput
                )
                { onChange = UpdateSearch
                , text = model.searchQuery
                , placeholder = Just (Input.placeholder [] (text "Search threads"))
                , label = Input.labelHidden "message to send"
                }
            )
        , column
            [ width (px 300)
            , clipY
            , scrollbarY
            , htmlAttribute (Html.Attributes.style "height" "calc(100vh - 45px)")
            ]
            [ renderThreadList currentPage user model ]
        ]


renderThreadList : Page -> WebData User -> Model -> Element Msg
renderThreadList currentPage pendingUser model =
    case ( model.searchResult, model.threads, pendingUser ) of
        ( Success users, _, _ ) ->
            column [ width (maximum 260 <| fill) ]
                (users
                    |> List.map
                        (\user ->
                            link ([ padding 8 ] ++ Styles.readThread)
                                { url = "/chat/" ++ user.id
                                , label = paragraph [] [ text user.name ]
                                }
                        )
                )
        ( Loading, _, _) ->
            el [ padding 8 ] (text "Searching...")

        ( Failure _, _, _) ->
            el [ padding 8 ] (text "Error on searching users")

        ( _, Success threads, Success user ) ->
            column [ width (maximum 260 <| fill) ]
                (threads
                    |> List.filter (searchFilter user model)
                    |> List.map (renderThread currentPage user model)
                )

        ( _, Failure _, _ ) ->
            el [ padding 8 ] (text "Error on loading threads")

        ( _, _, Failure _ ) ->
            el [ padding 8 ] (text "Error on loading user")

        _ ->
            none


renderThread : Page -> User -> Model -> Thread -> Element Msg
renderThread currentPage user model thread =
    let
        threadStyle =
            if isUnread model thread.id then
                Styles.unreadThread

            else
                Styles.readThread

        currentThreadStyle =
            case currentPage of
                ChatPage threadId ->
                    if threadId == thread.id then
                        Styles.currentThread

                    else
                        []

                _ ->
                    []
    in
    link ([ padding 8 ] ++ threadStyle ++ currentThreadStyle)
        { url = "/chat/" ++ thread.id
        , label = paragraph [] [ text (threadName user thread) ]
        }


threadName : User -> Thread -> String
threadName user thread =
    let
        threadName_ =
            thread.participants
                |> List.map .name
                |> List.filter (\name -> name /= user.name)
                |> String.join ", "
    in
    case thread.name of
        Just name ->
            name

        Nothing ->
            if threadName_ == "" then
                user.name

            else
                threadName_


searchFilter : User -> Model -> Thread -> Bool
searchFilter user model thread =
    String.contains
        (String.toLower model.searchQuery)
        (String.toLower <| threadName user thread)
