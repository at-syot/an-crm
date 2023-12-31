```mermaid
---
title: DB design
---
erDiagram
    User {
      uuid id
      string lineID
      string phon-number
      string user-name
      string password
      string role
      bool active
    }

    Ticket {
      uuid id
      string name
      string detail
      string merchanName
      TicketStatus status
      string remark
      bool active

      string userId

      string createdBy
      datetime createdAt
      string updatedBy
      datetime updatedAt
    }

    TicketLogs {
      number(auto-generated) id
      uuid ticketId

      TicketStatus status
      datetime createdAt
      string createdBy
    }

    TicketStatus {
      string new
      string accepted
      string processing
      string finished
      string reject
    }

    TicketImage {
      number(auto-generated) id
      string fileName
      string extenstion
      string storagePath
      datetime expiredDate

      number ticketId
    }

    IssueTopic {
      uuid id
      string name
      uuid parentId
    }

    IssueTopic ||--|{ IssueTopic : tree
    User ||--|{ Ticket : have-many
    Ticket ||--|{ TicketImage : have-many
    Ticket ||--|| IssueTopic : x
    Ticket ||--|{ TicketLogs : x
```
