# Read in data
raw.data <- read.csv('seattleWeather_1948-2017.csv', stringsAsFactors = FALSE)
data <- as.data.frame(raw.data)

# Clean dataset by breaking down date in to year, month, and day
data$year <- substr(data$DATE, 1,4)
data$month <- substr(data$DATE, 6,7)
data$day <- substr(data$DATE, 9,10)

# Export dataset as csv
write.csv(data, file = "data.csv")
