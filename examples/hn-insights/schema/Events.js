cube(`Events`, {
  sql: `
  SELECT * FROM hn_insights.events 
  WHERE ${FILTER_PARAMS.Events.timestamp.filter(`from_iso8601_timestamp(dt || ':00:00.000')`)}
  `,

  refreshKey: {
    sql: `select current_timestamp`
  },

  measures: {
    count: {
      type: `count`
    },

    scorePerMinute: {
      sql: `${scoreChange} / ${eventTimeSpan}`,
      type: `number`
    },

    eventTimeSpan: {
      sql: `date_diff('second', ${prevSnapshotTimestamp}, ${snapshotTimestamp}) / 60.0`,
      type: `sum`
    },

    scoreChange: {
      sql: `score_diff`,
      type: `sum`
    },

    karmaChange: {
      sql: `karma_diff`,
      type: `sum`
    },

    scoreChangeLastHour: {
      sql: `score_diff`,
      type: `sum`,
      filters: [{
        sql: `${timestamp} + interval '60' minute > now()`
      }, {
        sql: `${page} = 'front'`
      }]
    },

    scoreChangePrevHour: {
      sql: `score_diff`,
      type: `sum`,
      filters: [{
        sql: `${timestamp} + interval '60' minute < now()`
      }, {
        sql: `${timestamp} + interval '120' minute > now()`
      }, {
        sql: `${page} = 'front'`
      }]
    },

    karmaChangeLastHour: {
      sql: `karma_diff`,
      type: `sum`,
      filters: [{
        sql: `${timestamp} + interval '60' minute > now()`
      }, {
        sql: `${page} = 'front'`
      }]
    },

    karmaChangePrevHour: {
      sql: `karma_diff`,
      type: `sum`,
      filters: [{
        sql: `${timestamp} + interval '60' minute < now()`
      }, {
        sql: `${timestamp} + interval '120' minute > now()`
      }, {
        sql: `${page} = 'front'`
      }]
    },

    commentsChangeLastHour: {
      sql: `comments_count_diff`,
      type: `sum`,
      filters: [{
        sql: `${timestamp} + interval '60' minute > now()`
      }, {
        sql: `${page} = 'front'`
      }]
    },

    commentsChangePrevHour: {
      sql: `comments_count_diff`,
      type: `sum`,
      filters: [{
        sql: `${timestamp} + interval '60' minute < now()`
      }, {
        sql: `${timestamp} + interval '120' minute > now()`
      }, {
        sql: `${page} = 'front'`
      }]
    },

    rankHourAgo: {
      sql: `rank`,
      type: `min`,
      filters: [{
        sql: `${timestamp} + interval '60' minute < now()`
      }, {
        sql: `${timestamp} + interval '65' minute > now()`
      }, {
        sql: `${page} = 'front'`
      }]
    },

    currentRank: {
      sql: `rank`,
      type: `min`,
      filters: [{
        sql: `${timestamp} + interval '5' minute > now()`
      }, {
        sql: `${page} = 'front'`
      }]
    },

    currentScore: {
      sql: `CAST(NULLIF(score, '') as integer)`,
      type: `max`
    },

    currentComments: {
      sql: `comments_count`,
      type: `max`
    },

    commentsChange: {
      sql: `comments_count_diff`,
      type: `sum`
    },

    topRank: {
      sql: `rank`,
      type: `min`,
      filters: [{
        sql: `${page} = 'front'`
      }]
    },

    addedToFrontPage: {
      sql: `${timestamp}`,
      type: `min`,
      filters: [{
        sql: `event = 'added'`
      }, {
        sql: `page = 'front'`
      }],
      shown: false
    },

    postedTime: {
      sql: `${timestamp}`,
      type: `min`,
      filters: [{
        sql: `event = 'added'`
      }, {
        sql: `page = 'newest'`
      }],
      shown: false
    },

    lastEventTime: {
      sql: `${timestamp}`,
      type: `max`,
      shown: false
    },

    commentsBeforeAddedToFrontPage: {
      sql: `comments_count_diff`,
      type: `sum`,
      filters: [{
        sql: `${timestamp} <= ${Stories.addedToFrontPage} or ${Stories.addedToFrontPage} is null`
      }, {
        sql: `page = 'newest'`
      }]
    },

    scoreChangeBeforeAddedToFrontPage: {
      sql: `score_diff`,
      type: `sum`,
      filters: [{
        sql: `${timestamp} <= ${Stories.addedToFrontPage} or ${Stories.addedToFrontPage} is null`
      }, {
        sql: `page = 'newest'`
      }]
    },

    karmaChangeBeforeAddedToFrontPage: {
      sql: `karma_diff`,
      type: `sum`,
      filters: [{
        sql: `${timestamp} <= ${Stories.addedToFrontPage} or ${Stories.addedToFrontPage} is null`
      }, {
        sql: `page = 'newest'`
      }]
    },

    minutesOnFirstPage: {
      sql: `date_diff('second', ${prevSnapshotTimestamp}, ${snapshotTimestamp}) / 60.0`,
      type: `sum`,
      filters: [{
        sql: `${rank} < 31`
      }, {
        sql: `${page} = 'front'`
      }]
    },

    eventTimeSpanBeforeAddedToFrontPage: {
      sql: `date_diff('second', ${prevSnapshotTimestamp}, ${snapshotTimestamp}) / 60.0`,
      type: `sum`,
      filters: [{
        sql: `${timestamp} <= ${Stories.addedToFrontPage} or ${Stories.addedToFrontPage} is null`
      }, {
        sql: `page = 'newest'`
      }],
      shown: false
    },

    scorePerMinuteWhenAddedToFrontPage: {
      sql: `${scoreChangeBeforeAddedToFrontPage} / ${eventTimeSpanBeforeAddedToFrontPage}`,
      type: `number`
    },
  },

  dimensions: {
    title: {
      sql: `title`,
      type: `string`
    },

    user: {
      sql: `user`,
      type: `string`
    },

    href: {
      sql: `href`,
      type: `string`
    },

    id: {
      sql: `id || timestamp`,
      type: `string`,
      primaryKey: true
    },

    event: {
      sql: `event`,
      type: `string`
    },

    timestamp: {
      sql: `cast(from_iso8601_timestamp(timestamp) as timestamp)`,
      type: `time`
    },

    snapshotTimestamp: {
      sql: `cast(from_iso8601_timestamp(snapshot_timestamp) as timestamp)`,
      type: `time`
    },

    prevSnapshotTimestamp: {
      sql: `cast(from_iso8601_timestamp(prev_snapshot_timestamp) as timestamp)`,
      type: `time`
    },

    page: {
      sql: `page`,
      type: `string`
    },

    rank: {
      sql: `rank`,
      type: `number`
    }
  },

  preAggregations: {
    perStory: {
      type: `rollup`,
      measureReferences: [scoreChange, commentsChange, karmaChange, topRank],
      dimensionReferences: [Stories.id, Events.page],
      timeDimensionReference: timestamp,
      granularity: `hour`,
      partitionGranularity: `day`,
      refreshKey: {
        sql: `select current_timestamp`
      },
      external: true
    },
    leaderBoard: {
      type: `rollup`,
      measureReferences: [
        scoreChangeLastHour,
        scoreChangePrevHour,
        commentsChangeLastHour,
        commentsChangePrevHour,
        karmaChangeLastHour,
        karmaChangePrevHour,
        rankHourAgo,
        currentRank,
        scoreChangeBeforeAddedToFrontPage,
        karmaChangeBeforeAddedToFrontPage,
        commentsBeforeAddedToFrontPage,
        minutesOnFirstPage,
        topRank,
        currentScore,
        currentComments
      ],
      dimensionReferences: [
        Stories.id,
        Stories.title,
        Stories.href,
        Stories.user,
        Stories.postedTime,
        Stories.addedToFrontPage,
        Stories.lastEventTime,
        Stories.minutesToFrontPage
      ],
      refreshKey: {
        sql: `select current_timestamp`
      },
      external: true
    }
  }
});
