export async function findSimilarShortTerm(userId, inputVecotr) {
  const vectorBuffer = Buffer.from(new Float32Array(inputVecotr).buffer);

  const query = `(@userId:{${userId}})=>[KNN 1 @embedding $vec AS score]`;

  const result = await redisClient.ft.search("memory_index", query, {
    PARAMS: {
      vec: vectorBuffer,
    },
    SORTBY: "score",
    DIALECT: 2,
    RETURN: ["content", "score"],
  });

  return result.documents;
}
