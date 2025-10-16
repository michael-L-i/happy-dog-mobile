// PetImages.tsx
// Centralized image mapping for breeds

const images: Record<string, any> = {
  breed0: {
    body: {
      "normal1": require("../images/breed0-normal-1.png"),
      "normal2": require("../images/breed0-normal-2.png"),
      "normal3": require("../images/breed0-normal-3.png"),
      "sleep1": require("../images/breed0-sleep-1.png"),
      "sleep2": require("../images/breed0-sleep-2.png"),
      "sleep3": require("../images/breed0-sleep-3.png"),
    },
    head: {
      1: require("../images/breed0-head-1.png"),
      2: require("../images/breed0-head-2.png"),
      3: require("../images/breed0-head-3.png"),
      4: require("../images/breed0-head-4.png"),
      5: require("../images/breed0-head-5.png"),
    },
  },  
  breed1: {
      body: {
        "normal1": require("../images/breed1-normal-1.png"),
        "normal2": require("../images/breed1-normal-2.png"),
        "normal3": require("../images/breed1-normal-3.png"),
        "sleep1": require("../images/breed1-sleep-1.png"),
        "sleep2": require("../images/breed1-sleep-2.png"),
        "sleep3": require("../images/breed1-sleep-3.png"),
      },
      head: {
        1: require("../images/breed1-head-1.png"),
        2: require("../images/breed1-head-2.png"),
        3: require("../images/breed1-head-3.png"),
        4: require("../images/breed1-head-4.png"),
        5: require("../images/breed1-head-5.png"),
      },
    },
    breed2: {
      body: {
        "normal1": require("../images/breed2-normal-1.png"),
        "normal2": require("../images/breed2-normal-2.png"),
        "normal3": require("../images/breed2-normal-3.png"),
        "sleep1": require("../images/breed2-sleep-1.png"),
        "sleep2": require("../images/breed2-sleep-2.png"),
        "sleep3": require("../images/breed2-sleep-3.png"),
      },
      head: {
        1: require("../images/breed2-head-1.png"),
        2: require("../images/breed2-head-2.png"),
        3: require("../images/breed2-head-3.png"),
        4: require("../images/breed2-head-4.png"),
        5: require("../images/breed2-head-5.png"),
      },
    },
    breed3: {
      body: {
        "normal1": require("../images/breed3-normal-1.png"),
        "normal2": require("../images/breed3-normal-2.png"),
        "normal3": require("../images/breed3-normal-3.png"),
        "sleep1": require("../images/breed3-sleep-1.png"),
        "sleep2": require("../images/breed3-sleep-2.png"),
        "sleep3": require("../images/breed3-sleep-3.png"),
      },
      head: {
        1: require("../images/breed3-head-1.png"),
        2: require("../images/breed3-head-2.png"),
        3: require("../images/breed3-head-3.png"),
        4: require("../images/breed3-head-4.png"),
        5: require("../images/breed3-head-5.png"),
      },
    },
    breed4: {
      body: {
        "normal1": require("../images/breed4-normal-1.png"),
        "normal2": require("../images/breed4-normal-2.png"),
        "normal3": require("../images/breed4-normal-3.png"),
        "sleep1": require("../images/breed4-sleep-1.png"),
        "sleep2": require("../images/breed4-sleep-2.png"),
        "sleep3": require("../images/breed4-sleep-3.png"),
      },
      head: {
        1: require("../images/breed4-head-1.png"),
        2: require("../images/breed4-head-2.png"),
        3: require("../images/breed4-head-3.png"),
        4: require("../images/breed4-head-4.png"),
        5: require("../images/breed4-head-5.png"),
      },
    },
    breed5: {
      body: {
        "normal1": require("../images/breed5-normal-1.png"),
        "normal2": require("../images/breed5-normal-2.png"),
        "normal3": require("../images/breed5-normal-3.png"),
        "sleep1": require("../images/breed5-sleep-1.png"),
        "sleep2": require("../images/breed5-sleep-2.png"),
        "sleep3": require("../images/breed5-sleep-3.png"),
      },
      head: {
        1: require("../images/breed5-head-1.png"),
        2: require("../images/breed5-head-2.png"),
        3: require("../images/breed5-head-3.png"),
        4: require("../images/breed5-head-4.png"),
        5: require("../images/breed5-head-5.png"),
      },
    },
    breed6: {
      body: {
        "normal1": require("../images/breed6-normal-1.png"),
        "normal2": require("../images/breed6-normal-2.png"),
        "normal3": require("../images/breed6-normal-3.png"),
        "sleep1": require("../images/breed6-sleep-1.png"),
        "sleep2": require("../images/breed6-sleep-2.png"),
        "sleep3": require("../images/breed6-sleep-3.png"),
      },
      head: {
        1: require("../images/breed6-head-1.png"),
        2: require("../images/breed6-head-2.png"),
        3: require("../images/breed6-head-3.png"),
        4: require("../images/breed6-head-4.png"),
        5: require("../images/breed6-head-5.png"),
      },
    },
    breed7: {
      body: {
        "normal1": require("../images/breed7-normal-1.png"),
        "normal2": require("../images/breed7-normal-2.png"),
        "normal3": require("../images/breed7-normal-3.png"),
        "sleep1": require("../images/breed7-sleep-1.png"),
        "sleep2": require("../images/breed7-sleep-2.png"),
        "sleep3": require("../images/breed7-sleep-3.png"),
      },
      head: {
        1: require("../images/breed7-head-1.png"),
        2: require("../images/breed7-head-2.png"),
        3: require("../images/breed7-head-3.png"),
        4: require("../images/breed7-head-4.png"),
        5: require("../images/breed7-head-5.png"),
      },
    },
    breed8: {
      body: {
        "normal1": require("../images/breed8-normal-1.png"),
        "normal2": require("../images/breed8-normal-2.png"),
        "normal3": require("../images/breed8-normal-3.png"),
        "sleep1": require("../images/breed8-sleep-1.png"),
        "sleep2": require("../images/breed8-sleep-2.png"),
        "sleep3": require("../images/breed8-sleep-3.png"),
      },
      head: {
        1: require("../images/breed8-head-1.png"),
        2: require("../images/breed8-head-2.png"),
        3: require("../images/breed8-head-3.png"),
        4: require("../images/breed8-head-4.png"),
        5: require("../images/breed8-head-5.png"),
      },
    },
    breed9: {
      body: {
        "normal1": require("../images/breed9-normal-1.png"),
        "normal2": require("../images/breed9-normal-2.png"),
        "normal3": require("../images/breed9-normal-3.png"),
        "sleep1": require("../images/breed9-sleep-1.png"),
        "sleep2": require("../images/breed9-sleep-2.png"),
        "sleep3": require("../images/breed9-sleep-3.png"),
      },
      head: {
        1: require("../images/breed9-head-1.png"),
        2: require("../images/breed9-head-2.png"),
        3: require("../images/breed9-head-3.png"),
        4: require("../images/breed9-head-4.png"),
        5: require("../images/breed9-head-5.png"),
      },
    },
    breed10: {
      body: {
        "normal1": require("../images/breed10-normal-1.png"),
        "normal2": require("../images/breed10-normal-2.png"),
        "normal3": require("../images/breed10-normal-3.png"),
        "sleep1": require("../images/breed10-sleep-1.png"),
        "sleep2": require("../images/breed10-sleep-2.png"),
        "sleep3": require("../images/breed10-sleep-3.png"),
      },
      head: {
        1: require("../images/breed10-head-1.png"),
        2: require("../images/breed10-head-2.png"),
        3: require("../images/breed10-head-3.png"),
        4: require("../images/breed10-head-4.png"),
        5: require("../images/breed10-head-5.png"),
      },
    },
    breed11: {
      body: {
        "normal1": require("../images/breed11-normal-1.png"),
        "normal2": require("../images/breed11-normal-2.png"),
        "normal3": require("../images/breed11-normal-3.png"),
        "sleep1": require("../images/breed11-sleep-1.png"),
        "sleep2": require("../images/breed11-sleep-2.png"),
        "sleep3": require("../images/breed11-sleep-3.png"),
      },
      head: {
        1: require("../images/breed11-head-1.png"),
        2: require("../images/breed11-head-2.png"),
        3: require("../images/breed11-head-3.png"),
        4: require("../images/breed11-head-4.png"),
        5: require("../images/breed11-head-5.png"),
      },
    },
    breed999999: {
      body: {
        "normal1": require("../images/breed999999-normal-1.png"),
        "normal2": require("../images/breed999999-normal-2.png"),
        "normal3": require("../images/breed999999-normal-3.png"),
        "sleep1": require("../images/breed999999-sleep-1.png"),
        "sleep2": require("../images/breed999999-sleep-2.png"),
        "sleep3": require("../images/breed999999-sleep-3.png"),
      },
      head: {
        1: require("../images/breed999999-head-1.png"),
        2: require("../images/breed999999-head-2.png"),
        3: require("../images/breed999999-head-3.png"),
        4: require("../images/breed999999-head-4.png"),
        5: require("../images/breed999999-head-5.png"),
      },
    },
    
    // breed2: {
    //   body: [
    //     require("../images/breed2-normal-2.png"),
    //     require("../images/breed2-normal-3.png"),
    //   ],
    //   head: {
    //     1: require("../images/breed2-head-1.png"),
    //     2: require("../images/breed2-head-2.png"),
    //     3: require("../images/breed2-head-3.png"),
    //     4: require("../images/breed2-head-4.png"),
    //     5: require("../images/breed2-head-5.png"),
    //   },
    // },
    // add more breeds here
  };
  
  export default images;
  