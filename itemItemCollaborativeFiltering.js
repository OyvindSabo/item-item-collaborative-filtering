const inputMatrix1 = [
  [1   , null, 3   , null, null, 5   , null, null], // Scores for item 0
  [null, null, 5   , 4   , null, null, 4   , null], // Scores for item 1
  [2   , 4   , null, 1   , 2   , null, 3   , null], // Scores for item 2
  [null, 2   , 4   , null, 5   , null, null, 4   ], // Scores for item 3
  [null, null, 4   , 3   , 4   , 2   , null, null], // Scores for item 4
  [1   , null, 3   , null, 3   , null, null /*P*/ , 2   ], // Scores for item 5
];

const inputMatrix2 = [
  [1   , null, 3   , null, null, 5   , null, null], // Scores for item 0
  [null, null, 5   , 4   , null, null, 4   , null], // Scores for item 1
  [2   , 4   , null, 1   , 2   , null, 3   , null], // Scores for item 2
  [null, 2   , 4   , null, 5   , null, null, 4   ], // Scores for item 3
  [null, null, 4   , 3   , 4   , 2   , null, null], // Scores for item 4
  [1   , null, 3   , null, 3   , null, null, 2   ], // Scores for item 5
];

// pearsonCorrelationCoefficient
const rowSimilarity = (row1, row2) => {
  const dividend = row1.map((rating, index) => rating*row2[index]).reduce((a, e) => a + e, 0);
  const squaredRow1 = row1.map(rating => Math.pow(rating, 2)).reduce((a, e) => a + e, 0);
  const squaredRow2 = row2.map(rating => Math.pow(rating, 2)).reduce((a, e) => a + e, 0);
  const divisor = Math.sqrt(squaredRow1)*Math.sqrt(squaredRow2);
  return dividend / divisor;
}

const suggestItemRatings = inputMatrix => {
  console.log('inputMatrix: ', inputMatrix);
  console.log('We calculate the mean rating for each row');
  const rowAverages = inputMatrix.map(row => {
    // ratingCount is the number of ratings, including 0 ratings
    const ratingCount = row.filter(rating => rating !== null).length;
    const ratingSum = row.reduce((accumulator, rating) => accumulator + rating, 0);
    return ratingCount === 0 ? 0 : ratingSum/ratingCount;
  });
  console.log('rowAverages: ', rowAverages);
  console.log('We subtract the average row rating from each rating in the corrsponding row');
  const devianceFromAverage = inputMatrix.map((row, rowIndex) => {
    return row.map(rating => rating === null ? 0 : rating - rowAverages[rowIndex]);
  });
  console.log('devianceFromAverage: ', devianceFromAverage);
  console.log('For each row, find the row\'s similarity to the each f the other rows');
  const rowSimilarities = [];
  devianceFromAverage.forEach((row1, index1) => {
    rowSimilarities.push([]);
    devianceFromAverage.forEach(row2 => {
      rowSimilarities[index1].push(rowSimilarity(row1, row2));
    });
  });
  console.log('rowSimilarities: ', rowSimilarities);
  console.log('We calculate the missing grading by finding the weighted average of the similarity multiplied by the grading for all other gradings in the same column')
  const completeMatrix = [];
  inputMatrix.forEach((rowToFillIn, rowIndex1) => {
    const completeRow = [];
    rowToFillIn.forEach((rating, columnIndex) => {
      if (rating !== null) {
        completeRow.push(rating);
      } else {
        let sum = 0;
        let count = 0;
        // For each grade in column
        inputMatrix.forEach((row, rowIndex2) => {
          if (inputMatrix[rowIndex2][columnIndex] !== null) {
            sum += row[columnIndex] * rowSimilarities[rowIndex1][rowIndex2];
            count += rowSimilarities[rowIndex1][rowIndex2];
          }
        });
        const suggestedGrading = sum / count;
        completeRow.push(suggestedGrading);
      }
    });
    completeMatrix.push(completeRow);
  });
  console.log('completeMatrix: ', completeMatrix);
}

suggestItemRatings(inputMatrix1);
suggestItemRatings(inputMatrix2);