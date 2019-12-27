module Threads.DataTest exposing (suite)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Json.Decode as Decode
import Test exposing (..)
import Threads.Data exposing (..)


suite : Test
suite =
    describe "Threads.Data"
        [ test "decodes json from fb api" <|
            \_ ->
                let
                    fixture =
                        """
                    [{"id":"100013303691123","name":"hidden","isGroup":false,"participants":[{"id":"100013303691123","name":"hidden","type":"User","canMessage":true,"isBlocked":false,"isMessengerUser":true,"profilePicLarge":"someurl","profilePicMedium":"someurl","profilePicSmall":"someurl"},{"id":"100026508605123","name":"hidden","type":"User","canMessage":true,"isBlocked":false,"isMessengerUser":true,"profilePicLarge":"someurl","profilePicMedium":"someurl","profilePicSmall":"someurl"}],"image":null,"unreadCount":0,"canReply":true,"cannotReplyReason":null,"isArchived":false,"color":null,"emoji":null,"nicknames":null},{"id":"1980143098765868","name":"hidden","isGroup":true,"participants":[{"id":"100012163325123","name":"hidden","type":"User","canMessage":true,"isBlocked":false,"isMessengerUser":true,"profilePicLarge":"someurl","profilePicMedium":"someurl","profilePicSmall":"someurl"},{"id":"100015817832123","name":"hidden","type":"User","canMessage":true,"isBlocked":false,"isMessengerUser":true,"profilePicLarge":"someurl","profilePicMedium":"someurl","profilePicSmall":"someurl"},{"id":"100026508605123","name":"hidden","type":"User","canMessage":true,"isBlocked":false,"isMessengerUser":true,"profilePicLarge":"someurl","profilePicMedium":"someurl","profilePicSmall":"someurl"}],"image":null,"unreadCount":0,"canReply":true,"cannotReplyReason":null,"isArchived":false,"color":null,"emoji":null,"nicknames":null},{"id":"2355930154434783","name":"hidden","isGroup":true,"participants":[{"id":"100012109303123","name":"hidden","type":"User","canMessage":true,"isBlocked":false,"isMessengerUser":true,"profilePicLarge":"someurl","profilePicMedium":"someurl","profilePicSmall":"someurl"},{"id":"100015817832123","name":"hidden","type":"User","canMessage":true,"isBlocked":false,"isMessengerUser":true,"profilePicLarge":"someurl","profilePicMedium":"someurl","profilePicSmall":"someurl"},{"id":"100026508605123","name":"hidden","type":"User","canMessage":true,"isBlocked":false,"isMessengerUser":true,"profilePicLarge":"someurl","profilePicMedium":"someurl","profilePicSmall":"someurl"}],"image":null,"unreadCount":0,"canReply":true,"cannotReplyReason":null,"isArchived":false,"color":null,"emoji":null,"nicknames":null}]
                    """
                in
                fixture
                    |> Decode.decodeString decodeThreads
                    |> Result.toMaybe
                    |> Maybe.andThen
                        (\threads ->
                            List.head threads
                                |> Maybe.map .id
                        )
                    |> Expect.equal (Just "100013303691123")
        , test "decodes json from search results api" <|
            \_ ->
                let
                    fixture =
                        """
                    [{"subtext":"Lead Developer","node":{"id":"100012124841030","name":"Esteban Beltran","username":"","is_memorialized":false,"is_viewer_friend":false,"is_viewer_coworker":true,"work_foreign_entity_info":{"type":"NOT_FOREIGN"},"profile_picture":{"uri":"https://scontent.xx.fbcdn.net/v/t1.0-1/cp0/e15/q65/p50x50/80004649_831001827313971_7917310196249001984_n.jpg?_nc_cat=104&_nc_oc=AQmCc_9ObPiydO1o0BWDPuYoLZPF-Q9y61X8fBNNQUL5tk4r01m9jkgiscLuyie8xXI&_nc_ad=z-m&_nc_cid=0&_nc_zor=9&_nc_ht=scontent.xx&oh=c19df4c1a5deddf0e8cd6528528348f2&oe=5E9FB080"},"messenger_contact":{"is_on_viewer_contact_list":true},"url":"https://booking.facebook.com/profile.php?id=100012124841030","is_messenger_user":true,"is_work_user":true,"is_verified":false,"viewer_affinity":0.08500000089407,"scim_company_user":{"company_title":"Lead Developer"},"work_info":{"is_active_account":true,"work_community":{"name":"Booking.com"}},"members":{"edges":[]}}},{"subtext":"Senior Partner Researcher","node":{"id":"100012923747912","name":"Ivana Braam-Estrada","username":"","is_memorialized":false,"is_viewer_friend":false,"is_viewer_coworker":true,"work_foreign_entity_info":{"type":"NOT_FOREIGN"},"profile_picture":{"uri":"https://scontent.xx.fbcdn.net/v/t1.0-1/cp0/e15/q65/p50x50/71306190_781813875592730_4563835023278473216_n.jpg?_nc_cat=106&_nc_oc=AQksws_3P3Spba1SxjaKk99EJto4lfeoqMEGSDWiifxYmlIYHHivYamznIzpb1SLAvs&_nc_ad=z-m&_nc_cid=0&_nc_zor=9&_nc_ht=scontent.xx&oh=0622b6bd2de71fb4ed94a4e4735303b0&oe=5E6D6521"},"messenger_contact":{"is_on_viewer_contact_list":true},"url":"https://booking.facebook.com/profile.php?id=100012923747912","is_messenger_user":true,"is_work_user":true,"is_verified":false,"viewer_affinity":0,"scim_company_user":{"company_title":"Senior Partner Researcher"},"work_info":{"is_active_account":true,"work_community":{"name":"Booking.com"}},"members":{"edges":[]}}}]
                    """
                in
                fixture
                    |> Decode.decodeString decodeSearchResults
                    |> Result.toMaybe
                    |> Maybe.withDefault []
                    |> Expect.equal
                        [ { id = "100012124841030", name = "Esteban Beltran" }
                        , { id = "100012923747912", name = "Ivana Braam-Estrada" }
                        ]
        ]
