package models

type Category struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Name        string `gorm:"size:100;not null" json:"name"`
	Slug        string `gorm:"size:100;uniqueIndex;not null" json:"slug"`
	IconURL     string `json:"icon_url"`
	Description string `gorm:"type:text" json:"description"`
}
