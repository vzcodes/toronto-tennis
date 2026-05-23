
# Project on Visualizing where to Play Tennis in Toronto

## Features
- See all the tennis courts in Toronto which one can play.
- Lighted tennis courts (night tennis)
- Different surfaces of court
- Court operators
- Planning tennis practices

### Court Surfaces 
- Hard courts (standard)
- Green Clay courts
- Asphalt courts
- Other

### Different Court Operators
- Public tennis courts owned by the City of Toronto and those with no club play
- Public tennis courts owned by the City of Toronto, club play available, and their public hours. When the public hours are
- Number of courts
- Public tennis courts owned by the City of Toronto with reservations accepted
- Private tennis clubs with public membership - Whether these clubs are year round or only winter. e.g. Mayfair West, Eglinton Flats, Premier Racket Clubs. 
- Private tennis clubs with private membership (luxury clubs) e.g. Royal Canadian Yacht Club
- TDSB tennis courts
- CTDSB tennis courts
- Private Courts (owned by individuals/buildings/private schools, no public access), e.g. UCC tennis, National Tennis Training Centre (Sobeys Stadium)

### Statistics
Statistics for number of courts in each region. Number of courts per capita compared to other regions in Canada. Historical reference for increases in courts. 

## Goals of the website
- Tennis players should more easily be able to find out where to play tennis
- Tennis players should be able to find new places to play which they had not originally thought about
- Tennis players should know how to find their closest tennis courts
- Tennis players should be able to rate the quality of courts and the general business of the courts to assist others in finding places to play
- Increase the popularity of tennis for those who play infrequently, avoid  players waiting in lineups of over 8 rackets. 
- Increase the awareness of the Toronto tennis system and the community tennis model
- Increase the awareness of the ability to run local programs and book courts within the city and school boards. 
- Increase awareness of the limited tennis opportunities within the City of Toronto. 
- Increase awareness of public hours at community clubs (ensure that community clubs adhere to these rules). 
- Build a community / discussion / area for folks to talk about tennis. E.g. better than Facebook where people discuss tennis in Toronto and find players to play with. 
    - This can be extremely easy to set up. Simple account 2FA integration to get the username of the user/login. Then they can indicate that they are open to play at various parks/regions and then connect with others who are also in similar situation. 
    - Must have verified email address, verified phone number
- Understand the size of wait-lists
- List future Tennis Courts/Tennis Centres that are in the works.

## Current Site
The homepage is a self-contained static page in [index.html](index.html) that reads [courts.csv](new_courts.csv) directly in the browser. The current build includes search, filters, nearest-courts sorting when geolocation is allowed, and map links for each venue. 
